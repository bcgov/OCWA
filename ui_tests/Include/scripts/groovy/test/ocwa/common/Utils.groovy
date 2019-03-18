package test.ocwa.common

import com.kms.katalon.core.testobject.ConditionType
import com.kms.katalon.core.testobject.TestObject

/**
 * OCWA Helper and Utility functions for Katalon
 * @author Jeremy Ho
 */
class Utils {
	/**
	 * Returns a pseudo-random string for request names
	 * @return A string in the format "auto_gen_<current date-time>"
	 */
	static def generateRequestNameDate() {
		return 'auto_gen_'.concat(new Date().format('MMddyy-hhmmss'))
	}

	//Helper function for getting TestObject from the id of an html element
	static def get_test_object_by_id(String id) {
		TestObject tObject = new TestObject(id)
		tObject.addProperty("id", ConditionType.EQUALS, id, true)
		return tObject
	}

	//Helper function for getting TestObject from the text of an html element
	static def get_test_object_by_text(String t) {
		TestObject tObject = new TestObject(t)
		tObject.addProperty("tag", ConditionType.EQUALS, "a", true)
		tObject.addProperty("text", ConditionType.EQUALS, t, true)
		return tObject
	}

	//Helper function for getting TestObject from the class of an html element
	static def get_test_object_by_class(String t) {
		TestObject tObject = new TestObject(t)
		tObject.addProperty("class", ConditionType.EQUALS, t, true)
		return tObject
	}
}
