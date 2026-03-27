package servlet;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import dao.LeaveDAO;
import model.Leave;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@WebServlet(urlPatterns = {"/api/leaves", "/api/leaves/process"})
public class LeaveServlet extends HttpServlet {
    private LeaveDAO dao = new LeaveDAO();
    private Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        List<Leave> list = dao.getAllLeaves();
        resp.setContentType("application/json");
        resp.getWriter().write(gson.toJson(list));
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String path = req.getServletPath();
        boolean success = false;

        if (path.equals("/api/leaves/process")) {
            String body = req.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
            JsonObject json = gson.fromJson(body, JsonObject.class);
            int id = json.get("id").getAsInt();
            String status = json.get("status").getAsString();
            int approvedBy = 1; // Defaulting to Admin for demo
            String remarks = "Processed via Web Dashboard";

            success = dao.processLeave(id, status, approvedBy, remarks);
        }

        resp.setContentType("application/json");
        resp.getWriter().write("{\"success\": " + success + "}");
    }
}
