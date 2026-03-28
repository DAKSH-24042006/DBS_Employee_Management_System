package servlet;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import dao.EmployeeDAO;
import model.Employee;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Date;
import java.util.List;
import java.util.stream.Collectors;

public class EmployeeServlet extends HttpServlet {
    private EmployeeDAO dao = new EmployeeDAO();
    private Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        List<Employee> list = dao.getAllEmployees();
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
            
            Employee emp = new Employee();
            emp.setName(json.get("name").getAsString());
            emp.setDepartment(json.get("department").getAsString());
            emp.setDesignation(json.get("designation").getAsString());
            emp.setContactDetails(json.has("contact") ? json.get("contact").getAsString() : "N/A");
            emp.setDateOfJoining(new Date(System.currentTimeMillis()));

            String username = json.has("username") ? json.get("username").getAsString() : "user_" + System.currentTimeMillis();
            String password = json.has("password") ? json.get("password").getAsString() : "password123";
            String role = "Employee";
            
            boolean success = dao.addEmployee(emp, username, password, role);

            JsonObject responseJson = new JsonObject();
            responseJson.addProperty("success", success);
            if (success) {
                resp.setStatus(HttpServletResponse.SC_CREATED);
                responseJson.addProperty("message", "Employee added successfully");
            } else {
                resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                responseJson.addProperty("message", "Failed to add employee");
            }
            resp.getWriter().write(gson.toJson(responseJson));
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            JsonObject errorJson = new JsonObject();
            errorJson.addProperty("success", false);
            errorJson.addProperty("message", "Invalid request body: " + e.getMessage());
            resp.getWriter().write(gson.toJson(errorJson));
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        
        String idParam = req.getParameter("id");
        if (idParam == null) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"success\": false, \"message\": \"Missing id parameter\"}");
            return;
        }

        try {
            int id = Integer.parseInt(idParam);
            boolean success = dao.deleteEmployee(id);
            
            JsonObject responseJson = new JsonObject();
            responseJson.addProperty("success", success);
            if (success) {
                responseJson.addProperty("message", "Employee deleted successfully");
            } else {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                responseJson.addProperty("message", "Employee not found or deletion failed");
            }
            resp.getWriter().write(gson.toJson(responseJson));
        } catch (NumberFormatException e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"success\": false, \"message\": \"Invalid id format\"}");
        }
    }
}
