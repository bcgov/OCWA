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

	final class Alerts {
		static final def SUCCESS_UPDATED_TEXT = 'Successfully updated'
		static final def LOADING_TEXT = 'Loading...'
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
		static final def LOGIN_BTN_ID = 'app-auth-login-button'
		static final def LOGOUT_URL = '/auth/logout'
	}

	final class Requester {
		static final def TEST_COMMENT = 'Test Comment'
		static final def PURPOSE_TEXT = 'The purpose of my project is X'
		static final def EDITED_PURPOSE_TEXT = 'Edited the purpose to be Y'
		static final def CONFIDENTIALITY_TEXT = 'My results are confidential because... X'
		static final def EDITED_CONFIDENTIALITY_TEXT = 'Edited the reason my results are confidential'

		//static final def NEW_REQUEST_BTN_ID = 'new-request-button'
		static final def NEW_REQUEST_BTN_TXT = 'New Request'
		static final def NEW_REQUEST_DIALOG_ID = 'request-form'
		static final def SEARCH_BOX_ID = 'requests-list-search'

		static final def REQUEST_CANCEL_BTN_ID = 'request-sidebar-cancel-button'
		static final def REQUEST_DISCUSSION_FORM_ID = 'discussion-form'
		static final def REQUEST_DISCUSSION_TAB_ID = 'request-discussion-tab'
		static final def REQUEST_EDIT_BTN_ID = 'request-sidebar-edit-button'
		//static final def REQUEST_FILES_UPLOAD_BTN_ID = 'file-uploader-input'
		static final def REQUEST_OUTPUT_FILES_UPLOAD_BTN_ID = 'request-export-files'
		static final def REQUEST_SUPPORTING_FILES_UPLOAD_BTN_ID = 'request-supporting-files'
		//static final def REQUEST_NAME_TXT_ID = 'name'
		static final def REQUEST_NAME_TXT_ID = 'name-uid7'
		static final def REQUEST_PATH = '/requests/'
		//static final def REQUEST_PURPOSE_TXT_ID = 'purpose'
		static final def REQUEST_PURPOSE_TXT_ID = 'purpose-uid8'
		static final def REQUEST_PURPOSE_EDT_TXT_ID = 'request-purpose-input'
		static final def REQUEST_PURPOSE_LBL_TXT_ID = 'request-purpose-text'
		static final def REQUEST_CONFIDENTIALITY_TXT_ID = 'confidentiality-uid13'
		static final def REQUEST_CONFIDENTIALITY_EDT_TXT_ID = 'request-confidentiality-input'
		static final def REQUEST_CONFIDENTIALITY_LBL_TXT_ID = 'request-confidentiality-text'

		static final def REQUEST_SAVE_BTN_ID = 'request-form-save-button'
		static final def REQUEST_SAVE_CLOSE_BTN_ID = 'request-form-save-close-button'
		static final def REQUEST_SAVE_FILES_BTN_ID = 'request-form-save-files-button'
		// Submit button on the request page
		static final def REQUEST_SUBMIT_BTN_ID = 'request-sidebar-submit-button'
		static final def REQUEST_UPLOAD_TAB_OUTPUT_ID = 'file-upload-tab-output'
		static final def REQUEST_UPLOAD_TAB_SUPPORT_ID = 'file-upload-tab-support'
		static final def REQUEST_WITHDRAW_BTN_ID = 'request-sidebar-withdraw-button'
	}

	final class Status {
		static final def APPROVED = 'Approved'
		static final def AWAITING_REVIEW = 'Awaiting Review'
		static final def CANCELLED = 'Cancelled'
		static final def DRAFT = 'Draft'
		static final def SUBMITTED = 'Queued/In Review'
		static final def WORK_IN_PROGRESS = 'Work in Progress'
	}
}
