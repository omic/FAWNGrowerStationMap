package fawngrowermap;

import java.io.IOException;
//import javax.servlet.http.*;
import javax.servlet.http.*;

@SuppressWarnings("serial")
public class FAWNGrowerMapServlet extends HttpServlet {
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		resp.setContentType("text/plain");
		resp.getWriter().println("Hello, world");
	}
}
