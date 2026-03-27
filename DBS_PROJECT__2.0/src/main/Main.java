package main;

import com.sun.net.httpserver.HttpServer;
import api.*;
import java.io.IOException;
import java.net.InetSocketAddress;

public class Main {
    public static void main(String[] args) throws IOException {
        int port = 8080;
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);

        // API Endpoints
        server.createContext("/api/employees", new EmployeeHandler());
        server.createContext("/api/attendance", new AttendanceHandler());
        server.createContext("/api/leaves", new LeaveHandler());
        server.createContext("/api/reports", new ReportHandler());

        // Static Files (Frontend)
        server.createContext("/", new StaticFileHandler());

        server.setExecutor(null); // default executor
        System.out.println("DBMS Project Web Server started at http://localhost:" + port);
        server.start();
    }
}
