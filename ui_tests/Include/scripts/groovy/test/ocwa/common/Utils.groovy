package test.ocwa.common

import com.kms.katalon.core.testobject.ConditionType
import com.kms.katalon.core.testobject.TestObject

/**
 * OCWA Helper and Utility functions for Katalon
 * @author Jeremy Ho
 */
public class Utils {
	/**
	 * Returns a pseudo-random string for request names
	 * @return A string in the format "auto_gen_<current date-time>"
	 */
	static def generateRequestNameDate() {
		return 'auto_gen_'.concat(new Date().format('MMddyy-hhmmss'))
	}

	/**
	 * Returns the TestObject correlating to the id
	 * @param id The id of the element to filter on
	 * @return TestObject
	 */
	static def getTestObjectById(String id) {
		TestObject tObject = new TestObject(id)
		tObject.addProperty('id', ConditionType.EQUALS, id, true)
		return tObject
	}

	/**
	 * Returns the TestObject correlating to a web element that has an id which contains idPart
	 * @param id The id of the element to filter on
	 * @return TestObject
	 */
	static def getTestObjectByIdPart(String idPart) {
		TestObject tObject = new TestObject(idPart)
		tObject.addProperty('id', ConditionType.CONTAINS, idPart, true)
		return tObject
	}
	
	/**
	 * Returns the TestObject correlating to the text
	 * @param text The text string to filter on
	 * @param tag The optional html tag element to filter on.
	 * Defaults to the 'a' tag. Set as null to make a more generic search
	 * @return TestObject
	 */
	// TODO: Consider inverting tag default to null instead of a
	static def getTestObjectByText(String text, String tag = 'a') {
		TestObject tObject = new TestObject(text)
		tObject.addProperty('text', ConditionType.EQUALS, text, true)
		if(tag) tObject.addProperty('tag', ConditionType.EQUALS, tag, true)
		return tObject
	}

	/**
	 * Returns the TestObject correlating to the class
	 * @param cls The class attribute to filter on
	 * @return TestObject
	 */
	static def getTestObjectByClass(String cls) {
		TestObject tObject = new TestObject(cls)
		tObject.addProperty('class', ConditionType.EQUALS, cls, true)
		return tObject
	}

	/**
	 * Returns the TestObject correlating to the given xpath
	 * @param path The xpath string to filter on
	 * @return TestObject
	 */
	static def getTestObjectByXPath(String path) {
		TestObject tObject = new TestObject(path)
		tObject.addProperty('xpath', ConditionType.EQUALS, path, true)
		return tObject
	}
}
