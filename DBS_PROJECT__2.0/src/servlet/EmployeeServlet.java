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

@WebServlet("/api/employees")
public class EmployeeServlet extends HttpServlet {
    private EmployeeDAO dao = new EmployeeDAO();
    private Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        List<Employee> list = dao.getAllEmployees();
        resp.setContentType("application/json");
        resp.getWriter().write(gson.toJson(list));
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String body = req.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
        JsonObject json = gson.fromJson(body, JsonObject.class);
        
        String username = json.has("username") ? json.get("username").getAsString() : "user_" + System.currentTimeMillis();
        String password = json.has("password") ? json.get("password").getAsString() : "password123";
        String name = json.get("name").getAsString();
        String dept = json.get("department").getAsString();
        String desig = json.get("designation").getAsString();
        String contact = json.has("contact") ? json.get("contact").getAsString() : "N/A";
        String role = "Employee"; // Default for new signups/additions
        
        boolean success = dao.addEmployee(
            username, password, role,
            name, dept, desig, contact,
            new Date(System.currentTimeMillis())
        );

        resp.setContentType("application/json");
        resp.getWriter().write("{\"success\": " + success + "}");
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        int id = Integer.parseInt(req.getParameter("id"));
        boolean success = dao.deleteEmployee(id);
        resp.setContentType("application/json");
        resp.getWriter().write("{\"success\": " + success + "}");
    }
}
