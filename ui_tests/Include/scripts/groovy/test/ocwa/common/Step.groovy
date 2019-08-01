package test.ocwa.common

/**
 * Base Step class used to store "session" variables across the lifecycle of a specific test run
 * @author Jeremy Ho
 */
public class Step {
	/**
	 * Session Request Name - edit these variables ONLY when creating a new request
	 */
	protected static def G_REQUESTNAME = ''
	protected static def G_REQUESTURL = ''
}
