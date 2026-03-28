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

public class LeaveServlet extends HttpServlet {
    private LeaveDAO dao = new LeaveDAO();
    private Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        List<Leave> list = dao.getAllLeaves();
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().write(gson.toJson(list));
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        
        try {
            String body = req.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
            JsonObject json = gson.fromJson(body, JsonObject.class);
            int id = json.get("id").getAsInt();
            String status = json.get("status").getAsString();
            int approvedBy = 1; 
            String remarks = "Processed via Web Dashboard";

            boolean success = dao.processLeave(id, status, approvedBy, remarks);
            
            JsonObject responseJson = new JsonObject();
            responseJson.addProperty("success", success);
            responseJson.addProperty("message", success ? "Leave processed successfully" : "Failed to process leave");
            resp.getWriter().write(gson.toJson(responseJson));
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"success\": false, \"message\": \"Invalid request body\"}");
        }
    }
}
