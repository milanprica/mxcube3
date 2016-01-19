from flask import session, redirect, url_for, render_template, request, Response, jsonify
from mxcube3 import app as mxcube
import logging
import itertools
import time
import os
import types

def convert_to_dict(ispyb_object):
    d = {}
    if type(ispyb_object) == types.DictType:
        d.update(ispyb_object)
    else:
        for key in ispyb_object.__keylist__:
            val = getattr(ispyb_object, key)
            if type(val) == types.InstanceType:
                val = convert_to_dict(val)
            elif type(val) == types.ListType:
                val = [convert_to_dict(x) if type(x)==types.InstanceType else x for x in val]
            elif type(val) == types.DictType:
               val = dict([(k, convert_to_dict(x) if type(x)==types.InstanceType else x) for k, x in val.iteritems()])
            d[key] = val
    return d

@mxcube.route("/mxcube/api/v0.1/login", methods=["POST"])
def login():
    beamline_name = os.environ.get("SMIS_BEAMLINE_NAME")
    content = request.get_json()
    loginID = content['proposal']
    password = content['password']
    logging.getLogger('HWR').info(loginID)

    loginRes = mxcube.db_connection.login(loginID, password)

#        loginRes structure
#        {'status':{ "code": "ok", "msg": msg }, 'Proposal': proposal,
#        'session': todays_session,
#        "local_contact": self.get_session_local_contact(todays_session['session']['sessionId']),
#        "person": prop['Person'],
#        "laboratory": prop['Laboratory']}

    return jsonify(loginRes)


@mxcube.route("/mxcube/api/v0.1/samples/<proposal_id>")
def proposal_samples(proposal_id):
   # session_id is not used, so we can pass None as second argument to 'db_connection.get_samples'
   samples_info_list = [convert_to_dict(x) for x in mxcube.db_connection.get_samples(proposal_id, None)]

   for sample_info in samples_info_list:
     try:
         basket = int(sample_info["containerSampleChangerLocation"])
     except (TypeError, ValueError):
         continue
     else:
         if mxcube.sample_changer.__class__.__TYPE__ == 'Robodiff':
             cell = int(round((basket+0.5)/3.0))
             puck = basket-3*(cell-1)
             sample_info["containerSampleChangerLocation"] = "%d:%d" % (cell, puck)

   return jsonify({ "samples_info": samples_info_list })