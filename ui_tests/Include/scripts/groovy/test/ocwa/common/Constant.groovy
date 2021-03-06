package test.ocwa.common

/**
 * OCWA Constants for Katalon
 * @author Jeremy Ho, Paul Ripley
 */
public class Constant {
	Constant() {
		throw new UnsupportedOperationException();
	}

	static final def DEFAULT_TIMEOUT = 10
	static final def FILE_UPLOAD_TIMEOUT = 10
	static final def DOWNLOAD_INTERFACE_TIMEOUT = 2
	static final def ASSIGN_TO_ME_TIMEOUT = 2
	static final def STATUS_CHECK_WAIT = 2

	final class Alerts {
		static final def SUCCESS_UPDATED_TEXT = 'Successfully updated'
		static final def LOADING_TEXT = 'Loading...'
		static final def SUCCESS_SUBMIT_TEXT = 'Request submitted'
		static final def ERROR_TEXT = 'Error'
	}

	final class Checker {
		static final def ASSIGN_REQUEST_TO_ME_ID = 'request-sidebar-pickup-button'
		static final def APPROVE_REQUEST_BTN_ID = 'request-sidebar-approve-button'
		static final def OC_DASHBOARD_FILTERS_ID = 'oc-dashboard-filters-select'
		static final def OC_DASHBOARD_SHOW_ALL_REQUESTS = 'Show All Requests'
		static final def REQUEST_ASSIGNED_TO_ID = 'request-assigned-oc'
		static final def REVISIONS_NEEDED_REQUEST_BTN_ID = 'request-sidebar-request-revisions-button'
	}

	final class FileIcon {
		static final def ERROR = 'file-table-item-error-icon'
		static final def VALID = 'file-table-item-passing-icon'
		static final def WARNING = 'file-table-item-warning-icon'
	}

	final class Login {
		static final def LOGOUT_URL = '/auth/logout'
	}

	final class Requester {
		static final def FORM_LOAD_WAIT = 1
		static final def CANCEL_CLICK_WAIT = 2
		static final def EDIT_BTN_WAIT = 2
		static final def WITHDRAW_CLICK_WAIT = 2
		static final def TEST_COMMENT = 'Test Comment'
		static final def FILE_DISPLAY_WAIT = 2
		static final def FILE_DISPLAY_LOAD_WAIT = 2
		static final def EDIT_FIELD_WAIT = 1
		static final def CONFIDENTIALITY_TEXT = 'My results are confidential because... X'
		static final def EDITED_CONFIDENTIALITY_TEXT = 'Edited the reason my results are confidential'

		static final def NEW_REQUEST_BTN_TXT = 'New Request'
		static final def NEW_REQUEST_DIALOG_ID = 'request-form'
		static final def SEARCH_BOX_ID = 'requests-list-search'

		static final def REQUEST_CANCEL_BTN_ID = 'request-sidebar-cancel-button'
		static final def REQUEST_DISCUSSION_FORM_ID = 'discussion-form'
		static final def REQUEST_DISCUSSION_TAB_ID = 'request-discussion-tab'
		static final def REQUEST_EDIT_BTN_ID = 'request-sidebar-edit-button'

		static final def REQUEST_OUTPUT_FILES_UPLOAD_BTN_XPATH = "//div[@id='request-export-files']/descendant::input[@type='file']"
		static final def REQUEST_SUPPORT_FILES_UPLOAD_BTN_XPATH = "//div[@id='request-support-files']/descendant::input[@type='file']"

		static final def REQUEST_NAME_TXT_ID = 'data[name]'
		static final def REQUEST_PATH = '/requests/'

		static final def REQUEST_CONFIDENTIALITY_TXT_ID = 'data[confidentiality]'
		static final def REQUEST_CONFIDENTIALITY_EDT_TXT_ID = 'data[confidentiality]'
		static final def REQUEST_CONFIDENTIALITY_LBL_TXT_ID = 'request-confidentiality-text'
		static final def REQUEST_PHONE_TXT_ID = 'data[phoneNumber]'
		static final def REQUEST_VARIABLE_TXT_ID = 'data[variableDescriptions]'
		static final def REQUEST_SUBPOP_TXT_ID = 'data[subPopulation]'
		static final def REQUEST_GENERAL_COMMENTS_TXT_ID = 'data[purpose]'

		static final def REQUEST_PHONE_TEXT = '555-555-5555'
		static final def REQUEST_VARIABLE_TEXT = 'My variables are...'
		static final def REQUEST_SUBPOP_TEXT = 'My sub-population is...'
		static final def GENERAL_COMMENTS_TEXT = 'My general comments...'

		// Submit button on the request page
		static final def REQUEST_SUBMIT_BTN_ID = 'request-sidebar-submit-button'
		static final def REQUEST_WITHDRAW_BTN_ID = 'request-sidebar-withdraw-button'

		// Download interface
		static final def DOWNLOAD_URL = '/downloads'
	}

	final class Status {
		static final def REQUEST_STATUS_ID = 'request-status'
		static final def CHECKER_UI_REQUEST_STATUS_ID_PART = 'state-label'
		static final def REPORTS_UI_REQUEST_STATUS_ID_PART = 'state-label'
		static final def APPROVED = 'Approved'
		static final def AWAITING_REVIEW = 'Awaiting Review'
		static final def CANCELLED = 'Cancelled'
		static final def DRAFT = 'Draft'
		static final def SUBMITTED = 'Queued/In Review'
		static final def WORK_IN_PROGRESS = 'Work in Progress'
		static final def IN_REVIEW = 'In Review'
	}

	final class CodeRequests {
		static final def REQUEST_REQUEST_TYPE_DD_ID = 'request-form-exportTypeSelect'
		static final def REQUEST_CODE_DESCRIPTION_TXT_ID = 'data[codeDescription]'
		static final def REQUEST_CODE_DESCRIPTION_TEXT = 'Some information about the code...'
		static final def REQUEST_LOCAL_REPO_TXT_ID = 'data[repository]'
		static final def REQUEST_REMOTE_REPO_TXT_ID = 'data[externalRepository]'
		static final def REQUEST_BRANCH_TXT_ID = 'data[branch]'
		static final def REQUEST_LOCAL_REPO_TEXT = 'https://secureresearch.com/username/internalrepo.git'
		static final def REQUEST_REMOTE_REPO_TEXT = 'https://github.com/username/myrep.git'
		static final def REQUEST_CODE_EXPORT_DD_VALUE = 'Code Export'
		static final def REQUEST_CODE_IMPORT_DD_VALUE = 'Code Import'
		static final def MERGE_INPROGRESS_TAG = 'strong'
		static final def MERGE_INPROGRESS_TEXT = 'Merge Request'
		static final def MERGE_COMPLETE_TAG = 'strong'
		static final def MERGE_COMPLETE_TEXT = 'Merge Request Complete'
		static final def MERGE_CANNOT_MERGE_TAG = 'strong'
		static final def MERGE_CANNOT_MERGE_TEXT = 'Merge request can not be merged.  Check that the MR has met all required criteria.'
		static final def MERGE_CANNOT_MERGE_TEXT_MISSING_PROJECT_REPO = 'SIM Project repository not found'
		static final def MERGE_TIMEOUT = 40
		static final def MERGE_BRANCH_HAPPY_PATH_TEXT = 'happy-1-develop'
		static final def MERGE_BRANCH_FAILED_SCAN = 's6-1-develop'
		static final def MERGE_BRANCH_MISSING_REPO_TEXT = 's4-1-develop'
		static final def HAVE_REVIEWED_CODE_CB_ID = 'viewed-mr'
		static final def MERGE_REQUEST_APPROVING_TEXT = 'Approving Request'
	}

	final class Reports {
		static final def REPORTS_VARIABLE_TXT_ID = 'request-details-variableDescriptions-text'
		static final def REQUEST_CHRONOLOGY_ID_PREFIX = 'request-chronology-item-state-'
		static final def REQUEST_CHRONOLOGY_DRAFT_STATE_NUMBER = '0'
		static final def REQUEST_CHRONOLOGY_WIP_STATE_NUMBER = '1'
		static final def REQUEST_CHRONOLOGY_AWAITING_REVIEW_STATE_NUMBER = '2'
		static final def REQUEST_CHRONOLOGY_IN_REVIEW_STATE_NUMBER = '3'
		static final def REQUEST_CHRONOLOGY_APPROVED_STATE_NUMBER = '4'
	}
}