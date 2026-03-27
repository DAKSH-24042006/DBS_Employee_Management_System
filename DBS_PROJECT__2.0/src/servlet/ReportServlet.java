package servlet;

import com.google.gson.Gson;
import dao.ReportDAO;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/api/reports")
public class ReportServlet extends HttpServlet {
    private ReportDAO dao = new ReportDAO();
    private Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String type = req.getParameter("type");
        List<String> result;

        if ("join".equalsIgnoreCase(type)) {
            result = dao.getJoinReport();
        } else if ("groupby".equalsIgnoreCase(type)) {
            result = dao.getGroupByReport();
        } else if ("nested".equalsIgnoreCase(type)) {
            result = dao.getNestedReport();
        } else {
            result = new ArrayList<>();
            result.add("Invalid report type");
        }

        resp.setContentType("application/json");
        resp.getWriter().write(gson.toJson(result));
    }
}
