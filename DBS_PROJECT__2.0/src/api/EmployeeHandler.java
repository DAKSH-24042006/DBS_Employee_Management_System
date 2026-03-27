package api;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import dao.EmployeeDAO;
import model.Employee;
import java.io.*;
import java.util.List;
import java.util.stream.Collectors;

public class EmployeeHandler implements HttpHandler {
    private EmployeeDAO dao = new EmployeeDAO();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        String response = "";
        int statusCode = 200;

        if (method.equalsIgnoreCase("GET")) {
            List<Employee> employees = dao.getAllEmployees();
            response = serializeEmployees(employees);
        } else if (method.equalsIgnoreCase("POST")) {
            String body = new BufferedReader(new InputStreamReader(exchange.getRequestBody())).lines().collect(Collectors.joining("\n"));
            // Simple manual parsing for demo purposes
            // In a real app, use Jackson or Gson
            if (dao.addEmployee("newuser", "pass", "Employee", "New Name", "IT", "Dev", "999", java.sql.Date.valueOf(java.time.LocalDate.now()))) {
               response = "{\"success\": true}";
            } else {
               response = "{\"success\": false}";
            }
        } else if (method.equalsIgnoreCase("DELETE")) {
            String query = exchange.getRequestURI().getQuery();
            int id = Integer.parseInt(query.split("=")[1]);
            if (dao.deleteEmployee(id)) response = "{\"success\": true}";
            else response = "{\"success\": false}";
        }

        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.sendResponseHeaders(statusCode, response.length());
        OutputStream os = exchange.getResponseBody();
        os.write(response.getBytes());
        os.close();
    }

    private String serializeEmployees(List<Employee> list) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < list.size(); i++) {
            Employee e = list.get(i);
            sb.append(String.format("{\"empId\":%d, \"name\":\"%s\", \"department\":\"%s\", \"designation\":\"%s\"}",
                e.getEmpId(), e.getName(), e.getDepartment(), e.getDesignation()));
            if (i < list.size() - 1) sb.append(",");
        }
        sb.append("]");
        return sb.toString();
    }
}
