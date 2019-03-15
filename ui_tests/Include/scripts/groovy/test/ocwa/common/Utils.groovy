package test.ocwa.common

import com.kms.katalon.core.annotation.Keyword

class Utils {
	@Keyword
	def gen_random_test_request_name() {
		return 'auto_eng'.concat(new Date().format('MMddyy-hhmm-ss'))
	}
}
