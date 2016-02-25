/*
 * Project Ginger Base
 *
 * Copyright IBM Corp, 2015-2016
 *
 * Code derived from Project Kimchi
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
gingerbase.report_add_main = function() {
    var reportGridID = 'available-reports-grid';
    var addReportForm = $('#form-report-add');
    var submitButton = $('#button-report-add');
    var nameTextbox = $('input[name="name"]', addReportForm);
    nameTextbox.select();

    var submitForm = function(event) {
        if(submitButton.prop('disabled')) {
            return false;
        }
        var reportName = nameTextbox.val();
        var validator = RegExp("^[_A-Za-z0-9-]*$");
        if (!validator.test(reportName)) {
            wok.message.error.code('GGBDR6011M','#alert-modal-debugreportadd-container', true);
            return false;
        }
        var formData = addReportForm.serializeObject();
        var taskAccepted = false;
        var onTaskAccepted = function() {
            if(taskAccepted) {
                return;
            }
            taskAccepted = true;
            wok.topic('gingerbase/debugReportAdded').publish();
            $('#button-report-cancel').trigger('click');
        };

        gingerbase.createReport(formData, function(result) {
            onTaskAccepted();
            wok.topic('gingerbase/debugReportAdded').publish();
             $('#button-report-cancel').trigger('click');
        }, function(result) {
            // Error message from Async Task status
            if (result['message']) {
                var errText = result['message'];
            }
            // Error message from standard gingerbase exception
            else {
                var errText = result['responseJSON']['reason'];
            }
            result && wok.message.error(errText,'#alert-modal-debugreportadd-container', true);

            taskAccepted &&
                $('.grid-body-view table tr:first-child',
                    '#' + reportGridID).remove();
            submitButton.prop('disabled', false);
            nameTextbox.select();
        }, onTaskAccepted);

        event.preventDefault();
    };

    addReportForm.on('submit', submitForm);
    submitButton.on('click', submitForm);
};
