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
gingerbase.report_rename_main = function() {
    var renameReportForm = $('#form-report-rename');
    var submitButton = $('#button-report-rename');
    var nameTextbox = $('input[name="name"]', renameReportForm);
    var submitForm = function(event) {
        if(submitButton.prop('disabled')) {
            return false;
        }
        var reportName = nameTextbox.val();

        // if the user hasn't changed the report's name,
        // nothing should be done.
        if (reportName == gingerbase.selectedReport) {
        wok.message.error.code('GGBDR6013M','#alert-modal-debugreportrename-container', true);
        return false;
        }

        var validator = RegExp("^[_A-Za-z0-9-]*$");
        if (!validator.test(reportName)) {
            wok.message.error.code('GGBDR6011M','#alert-modal-debugreportrename-container', true);
            return false;
        }
        var formData = renameReportForm.serializeObject();
        submitButton.prop('disabled', true);
        nameTextbox.prop('disabled', true);
        gingerbase.renameReport(gingerbase.selectedReport, formData, function(result) {
            submitButton.prop('disabled', false);
            nameTextbox.prop('disabled', false);
            wok.window.close();
            wok.topic('gingerbase/debugReportRenamed').publish({
                result: result
            });
        }, function(result) {
            var errText = result &&
                result['responseJSON'] &&
                result['responseJSON']['reason'];
            wok.message.error(errText,'#alert-modal-debugreportrename-container', true);
            submitButton.prop('disabled', false);
            nameTextbox.prop('disabled', false).focus();
        });

        event.preventDefault();
    };

    renameReportForm.on('submit', submitForm);
    submitButton.on('click', submitForm);

    nameTextbox.val(gingerbase.selectedReport).select();
};
