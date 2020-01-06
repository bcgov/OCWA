db.createUser(
    {
        user: "${MONGO_USERNAME}",
        pwd: "${MONGO_PASSWORD}",
        roles: [ "dbAdmin", "readWrite" ]
    }
);

db.forms.insert({
    "type" : "form",
    "tags" : [ 
        "common"
    ],
    "deleted" : null,
    "owner" : ObjectId("5dfbb474cf35c9b18ad8c16a"),
    "components" : [ 
        {
            "autofocus" : false,
            "input" : true,
            "tableView" : true,
            "inputType" : "text",
            "inputMask" : "",
            "label" : "Request Title",
            "key" : "name",
            "placeholder" : "",
            "prefix" : "",
            "suffix" : "",
            "multiple" : false,
            "defaultValue" : "",
            "protected" : false,
            "unique" : false,
            "persistent" : true,
            "hidden" : false,
            "clearOnHide" : true,
            "spellcheck" : true,
            "validate" : {
                "required" : true,
                "minLength" : "",
                "maxLength" : "",
                "pattern" : "",
                "custom" : "",
                "customPrivate" : false
            },
            "conditional" : {
                "show" : "",
                "when" : null,
                "eq" : ""
            },
            "type" : "textfield",
            "labelPosition" : "top",
            "inputFormat" : "plain",
            "tags" : [],
            "properties" : {},
            "lockKey" : true,
            "tooltip" : "",
            "description" : "It is recommended that you use a memorable title for this request."
        }, 
        {
            "autofocus" : false,
            "input" : true,
            "tableView" : true,
            "inputType" : "tel",
            "inputMask" : "999-999-9999",
            "label" : "Contact Phone Number",
            "key" : "phoneNumber",
            "placeholder" : "",
            "prefix" : "",
            "suffix" : "",
            "multiple" : false,
            "protected" : false,
            "unique" : false,
            "persistent" : true,
            "hidden" : false,
            "defaultValue" : "",
            "clearOnHide" : true,
            "validate" : {
                "required" : true
            },
            "type" : "phoneNumber",
            "labelPosition" : "top",
            "inputFormat" : "plain",
            "tags" : [],
            "conditional" : {
                "show" : "",
                "when" : null,
                "eq" : ""
            },
            "properties" : {},
            "description" : "Provide a phone number formatted xxx-xxx-xxxx to allow for quicker and more efficient contact if needed.",
            "lockKey" : true
        }, 
        {
            "autofocus" : false,
            "input" : true,
            "tableView" : true,
            "label" : "Variable Descriptions",
            "key" : "variableDescriptions",
            "placeholder" : "",
            "prefix" : "",
            "suffix" : "",
            "rows" : 3,
            "multiple" : false,
            "defaultValue" : "",
            "protected" : false,
            "persistent" : true,
            "hidden" : false,
            "wysiwyg" : false,
            "clearOnHide" : true,
            "spellcheck" : true,
            "validate" : {
                "required" : true,
                "minLength" : "",
                "maxLength" : "",
                "pattern" : "",
                "custom" : ""
            },
            "type" : "textarea",
            "labelPosition" : "top",
            "inputFormat" : "plain",
            "tags" : [],
            "conditional" : {
                "show" : "",
                "when" : null,
                "eq" : ""
            },
            "properties" : {},
            "description" : "Provide the variable/field names of the original and self-constructed variables. For original variables please use the name from the metadata.",
            "lockKey" : true
        }, 
        {
            "autofocus" : false,
            "input" : true,
            "tableView" : true,
            "label" : "Sub-Population",
            "key" : "subPopulation",
            "placeholder" : "",
            "prefix" : "",
            "suffix" : "",
            "rows" : 3,
            "multiple" : false,
            "defaultValue" : "",
            "protected" : false,
            "persistent" : true,
            "hidden" : false,
            "wysiwyg" : false,
            "clearOnHide" : true,
            "spellcheck" : true,
            "validate" : {
                "required" : true,
                "minLength" : "",
                "maxLength" : "",
                "pattern" : "",
                "custom" : ""
            },
            "type" : "textarea",
            "labelPosition" : "top",
            "inputFormat" : "plain",
            "tags" : [],
            "conditional" : {
                "show" : "",
                "when" : null,
                "eq" : ""
            },
            "properties" : {},
            "description" : "In the case of sub-samples and sub-populations, the selection criteria and size of the sub-samples.",
            "lockKey" : true
        }, 
        {
            "autofocus" : false,
            "input" : true,
            "tableView" : true,
            "label" : "Relationship to previous or future (planned) outputs",
            "key" : "selectionCriteria",
            "placeholder" : "",
            "prefix" : "",
            "suffix" : "",
            "rows" : 3,
            "multiple" : false,
            "defaultValue" : "",
            "protected" : false,
            "persistent" : true,
            "hidden" : false,
            "wysiwyg" : false,
            "clearOnHide" : true,
            "spellcheck" : true,
            "validate" : {
                "required" : false,
                "minLength" : "",
                "maxLength" : "",
                "pattern" : "",
                "custom" : ""
            },
            "type" : "textarea",
            "labelPosition" : "top",
            "inputFormat" : "plain",
            "tags" : [],
            "conditional" : {
                "show" : "",
                "when" : null,
                "eq" : ""
            },
            "properties" : {},
            "description" : "Describe any relationship to previous outputs. For example, a small adaptation of a previous output, pulled from the same or similar data, poses a risk of disclosure by differencing. This is especially for previously submitted tables within the same project, but could be, for example, other similar studies or projects based on the same sample of the population.",
            "lockKey" : true,
            "isNew" : false
        }, 
        {
            "autofocus" : false,
            "input" : true,
            "tableView" : true,
            "label" : "Explanation where outputs do not meet the rules of thumb",
            "key" : "confidentiality",
            "placeholder" : "",
            "prefix" : "",
            "suffix" : "",
            "rows" : 3,
            "multiple" : false,
            "defaultValue" : "",
            "protected" : false,
            "persistent" : true,
            "hidden" : false,
            "wysiwyg" : false,
            "clearOnHide" : true,
            "spellcheck" : true,
            "validate" : {
                "required" : false,
                "minLength" : "",
                "maxLength" : "",
                "pattern" : "",
                "custom" : ""
            },
            "type" : "textarea",
            "labelPosition" : "top",
            "inputFormat" : "plain",
            "tags" : [],
            "conditional" : {
                "show" : "",
                "when" : null,
                "eq" : ""
            },
            "properties" : {},
            "description" : "Confidentiality disclosure to describe how it's upheld when criteria isn't met --> If you are submitting outputs which do not meet the rules of thumb, provide an explanation why the output entails no disclosure.",
            "lockKey" : true
        }, 
        {
            "autofocus" : false,
            "input" : true,
            "label" : "Submit",
            "tableView" : false,
            "key" : "submit",
            "size" : "md",
            "leftIcon" : "",
            "rightIcon" : "",
            "block" : false,
            "action" : "submit",
            "disableOnInvalid" : false,
            "theme" : "primary",
            "type" : "button"
        }
    ],
    "display" : "form",
    "submissionAccess" : [ 
        {
            "roles" : [ 
                ObjectId("5dfbb466cf35c9b18ad8c15d")
            ],
            "type" : "create_own"
        }, 
        {
            "roles" : [ 
                ObjectId("5dfbb466cf35c9b18ad8c15d")
            ],
            "type" : "read_own"
        }, 
        {
            "roles" : [ 
                ObjectId("5dfbb466cf35c9b18ad8c15d")
            ],
            "type" : "update_own"
        }, 
        {
            "roles" : [ 
                ObjectId("5dfbb466cf35c9b18ad8c15d")
            ],
            "type" : "delete_own"
        }
    ],
    "title" : "dataexport",
    "name" : "dataexport",
    "path" : "dataexport",
    "access" : [ 
        {
            "roles" : [ 
                ObjectId("5dfbb466cf35c9b18ad8c15c"), 
                ObjectId("5dfbb466cf35c9b18ad8c15d"), 
                ObjectId("5dfbb466cf35c9b18ad8c15e")
            ],
            "type" : "read_all"
        }
    ],
    "created" : ISODate("2019-12-19T18:45:17.599Z"),
    "modified" : ISODate("2019-12-19T18:45:17.604Z"),
    "machineName" : "dataexport",
    "__v" : 0
});


db.forms.insert({
    "_id" : ObjectId("5dfbc77ccf35c9b18ad8c16e"),
    "type" : "form",
    "tags" : [ 
        "common"
    ],
    "deleted" : null,
    "owner" : ObjectId("5dfbb474cf35c9b18ad8c16a"),
    "components" : [ 
        {
            "autofocus" : false,
            "input" : true,
            "tableView" : true,
            "inputType" : "text",
            "inputMask" : "",
            "label" : "Request Title",
            "key" : "name",
            "placeholder" : "",
            "prefix" : "",
            "suffix" : "",
            "multiple" : false,
            "defaultValue" : "",
            "protected" : false,
            "unique" : false,
            "persistent" : true,
            "hidden" : false,
            "clearOnHide" : true,
            "spellcheck" : true,
            "validate" : {
                "required" : true,
                "minLength" : "",
                "maxLength" : "",
                "pattern" : "",
                "custom" : "",
                "customPrivate" : false
            },
            "conditional" : {
                "show" : "",
                "when" : null,
                "eq" : ""
            },
            "type" : "textfield",
            "labelPosition" : "top",
            "inputFormat" : "plain",
            "tags" : [],
            "properties" : {},
            "lockKey" : true,
            "description" : "It is recommended that you use a memorable title for this request."
        }, 
        {
            "autofocus" : false,
            "input" : true,
            "tableView" : true,
            "inputType" : "tel",
            "inputMask" : "999-999-9999",
            "label" : "Contact Phone Number",
            "key" : "phoneNumber",
            "placeholder" : "",
            "prefix" : "",
            "suffix" : "",
            "multiple" : false,
            "protected" : false,
            "unique" : false,
            "persistent" : true,
            "hidden" : false,
            "defaultValue" : "",
            "clearOnHide" : true,
            "validate" : {
                "required" : true
            },
            "type" : "phoneNumber",
            "labelPosition" : "top",
            "inputFormat" : "plain",
            "tags" : [],
            "conditional" : {
                "show" : "",
                "when" : null,
                "eq" : ""
            },
            "properties" : {},
            "description" : "Provide a phone number formatted xxx-xxx-xxxx to allow for quicker and more efficient contact if needed.",
            "lockKey" : true
        }, 
        {
            "autofocus" : false,
            "input" : true,
            "tableView" : true,
            "label" : "General comments about the code",
            "key" : "codeDescription",
            "placeholder" : "",
            "prefix" : "",
            "suffix" : "",
            "rows" : 3,
            "multiple" : false,
            "defaultValue" : "",
            "protected" : false,
            "persistent" : true,
            "hidden" : false,
            "wysiwyg" : false,
            "clearOnHide" : true,
            "spellcheck" : true,
            "validate" : {
                "required" : true,
                "minLength" : "",
                "maxLength" : "",
                "pattern" : "",
                "custom" : ""
            },
            "type" : "textarea",
            "labelPosition" : "top",
            "inputFormat" : "plain",
            "tags" : [],
            "conditional" : {
                "show" : "",
                "when" : null,
                "eq" : ""
            },
            "properties" : {},
            "description" : "Describe any details about the code you wish to export here.",
            "lockKey" : true
        }, 
        {
            "autofocus" : false,
            "input" : true,
            "tableView" : true,
            "inputType" : "text",
            "inputMask" : "",
            "label" : "Internal repository of code to export",
            "key" : "repository",
            "placeholder" : "",
            "prefix" : "",
            "suffix" : "",
            "multiple" : false,
            "defaultValue" : "",
            "protected" : false,
            "unique" : false,
            "persistent" : true,
            "hidden" : false,
            "clearOnHide" : true,
            "spellcheck" : true,
            "validate" : {
                "required" : true,
                "minLength" : "",
                "maxLength" : "",
                "pattern" : "",
                "custom" : "",
                "customPrivate" : false
            },
            "conditional" : {
                "show" : "",
                "when" : null,
                "eq" : ""
            },
            "type" : "textfield",
            "labelPosition" : "top",
            "inputFormat" : "plain",
            "tags" : [],
            "properties" : {},
            "description" : "Full URL of the repository",
            "lockKey" : true
        }, 
        {
            "autofocus" : false,
            "input" : true,
            "tableView" : true,
            "inputType" : "text",
            "inputMask" : "",
            "label" : "Branch of code to export",
            "key" : "branch",
            "placeholder" : "",
            "prefix" : "",
            "suffix" : "",
            "multiple" : false,
            "defaultValue" : "",
            "protected" : false,
            "unique" : false,
            "persistent" : true,
            "hidden" : false,
            "clearOnHide" : true,
            "spellcheck" : true,
            "validate" : {
                "required" : true,
                "minLength" : "",
                "maxLength" : "",
                "pattern" : "",
                "custom" : "",
                "customPrivate" : false
            },
            "conditional" : {
                "show" : "",
                "when" : null,
                "eq" : ""
            },
            "type" : "textfield",
            "labelPosition" : "top",
            "inputFormat" : "plain",
            "tags" : [],
            "properties" : {},
            "description" : "Branch name of the external repository.",
            "lockKey" : true
        }, 
        {
            "autofocus" : false,
            "input" : true,
            "tableView" : true,
            "inputType" : "text",
            "inputMask" : "",
            "label" : "External repository to send approved results",
            "key" : "externalRepository",
            "placeholder" : "",
            "prefix" : "",
            "suffix" : "",
            "multiple" : false,
            "defaultValue" : "",
            "protected" : false,
            "unique" : false,
            "persistent" : true,
            "hidden" : false,
            "clearOnHide" : true,
            "spellcheck" : true,
            "validate" : {
                "required" : true,
                "minLength" : "",
                "maxLength" : "",
                "pattern" : "",
                "custom" : "",
                "customPrivate" : false
            },
            "conditional" : {
                "show" : "",
                "when" : null,
                "eq" : ""
            },
            "type" : "textfield",
            "labelPosition" : "top",
            "inputFormat" : "plain",
            "tags" : [],
            "properties" : {},
            "description" : "Full URL of the external repository.",
            "lockKey" : true
        }, 
        {
            "autofocus" : false,
            "input" : true,
            "label" : "Submit",
            "tableView" : false,
            "key" : "submit",
            "size" : "md",
            "leftIcon" : "",
            "rightIcon" : "",
            "block" : false,
            "action" : "submit",
            "disableOnInvalid" : false,
            "theme" : "primary",
            "type" : "button"
        }
    ],
    "display" : "form",
    "submissionAccess" : [ 
        {
            "roles" : [ 
                ObjectId("5dfbb466cf35c9b18ad8c15d")
            ],
            "type" : "create_own"
        }, 
        {
            "roles" : [ 
                ObjectId("5dfbb466cf35c9b18ad8c15d")
            ],
            "type" : "read_own"
        }, 
        {
            "roles" : [ 
                ObjectId("5dfbb466cf35c9b18ad8c15d")
            ],
            "type" : "update_own"
        }, 
        {
            "roles" : [ 
                ObjectId("5dfbb466cf35c9b18ad8c15d")
            ],
            "type" : "delete_own"
        }
    ],
    "title" : "codeexport",
    "name" : "codeexport",
    "path" : "codeexport",
    "access" : [ 
        {
            "roles" : [ 
                ObjectId("5dfbb466cf35c9b18ad8c15c"), 
                ObjectId("5dfbb466cf35c9b18ad8c15d"), 
                ObjectId("5dfbb466cf35c9b18ad8c15e")
            ],
            "type" : "read_all"
        }
    ],
    "created" : ISODate("2019-12-19T18:54:52.420Z"),
    "modified" : ISODate("2019-12-19T18:54:52.423Z"),
    "machineName" : "codeexport",
    "__v" : 0
});



db.forms.find({});