#
# Project Ginger Base
#
# Copyright IBM Corp, 2015-2016
#
# Code derived from Project Kimchi
#
# This library is free software; you can redistribute it and/or
# modify it under the terms of the GNU Lesser General Public
# License as published by the Free Software Foundation; either
# version 2.1 of the License, or (at your option) any later version.
#
# This library is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# Lesser General Public License for more details.
#
# You should have received a copy of the GNU Lesser General Public
# License along with this library; if not, write to the Free Software
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301 USA

from wok.control.base import AsyncCollection, Resource
from wok.control.utils import internal_redirect
from wok.control.utils import UrlSubNode


DEBUGREPORTS_ACTIVITY = {
    'POST': {'default': "Create host debug report '%(name)s'"},
}

DEBUGREPORT_ACTIVITY = {
    'PUT':  {'default': "Update host debug report '%(ident)s'"},
    'DELETE':  {'default': "Remove host debug report '%(ident)s'"},
}


@UrlSubNode('debugreports', True)
class DebugReports(AsyncCollection):
    def __init__(self, model):
        super(DebugReports, self).__init__(model)
        self.resource = DebugReport
        self.role_key = 'dashboard'
        self.admin_methods = ['GET', 'POST']
        self.log_map = DEBUGREPORTS_ACTIVITY

    def _get_resources(self, filter_params):
        res_list = super(DebugReports, self)._get_resources(filter_params)
        return sorted(res_list, key=lambda x: x.data['time'], reverse=True)


class DebugReport(Resource):
    def __init__(self, model, ident):
        super(DebugReport, self).__init__(model, ident)
        self.role_key = 'dashboard'
        self.admin_methods = ['GET', 'PUT', 'POST']
        self.uri_fmt = '/debugreports/%s'
        self.content = DebugReportContent(model, ident)
        self.log_map = DEBUGREPORT_ACTIVITY

    @property
    def data(self):
        return {'name': self.ident,
                'uri': self.info['uri'],
                'time': self.info['ctime']}


class DebugReportContent(Resource):
    def __init__(self, model, ident):
        super(DebugReportContent, self).__init__(model, ident)
        self.role_key = 'dashboard'
        self.admin_methods = ['GET']

    def get(self):
        self.lookup()
        internal_uri = self.info['uri'].replace('plugins/gingerbase', '')
        raise internal_redirect(internal_uri)
