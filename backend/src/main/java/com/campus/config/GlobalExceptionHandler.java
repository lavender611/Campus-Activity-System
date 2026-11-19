package com.campus.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 统一把后端异常转换成 { success:false, message:"中文提示" }，
 * 这样前端始终能拿到可读的 message，而不会只看到一个 500 空白页。
 */
@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    private static Map<String, Object> body(String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("success", false);
        body.put("message", message);
        return body;
    }

    /** @Valid 校验失败：把所有字段错误拼成一句提示 */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> e.getDefaultMessage() == null ? e.getField() + " 不合法" : e.getDefaultMessage())
                .distinct()
                .collect(Collectors.joining("；"));
        return ResponseEntity.badRequest().body(body(message.isBlank() ? "请求参数不合法" : message));
    }

    /** 请求体不是合法 JSON，或日期格式无法解析 */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleUnreadable(HttpMessageNotReadableException ex) {
        log.warn("请求体解析失败: {}", ex.getMessage());
        return ResponseEntity.badRequest()
                .body(body("请求体格式错误：请提交合法 JSON，时间格式为 yyyy-MM-ddTHH:mm:ss"));
    }

    /** 业务校验失败，例如结束时间早于开始时间 */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(body(ex.getMessage()));
    }

    /** 主动抛出的 404 等状态码 */
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handleResponseStatus(ResponseStatusException ex) {
        String reason = ex.getReason() == null ? "请求处理失败" : ex.getReason();
        return ResponseEntity.status(ex.getStatusCode()).body(body(reason));
    }

    /** 路径不存在：返回 404，而不是被兜底成 500 */
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNoResource(NoResourceFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(body("接口或资源不存在：/" + ex.getResourcePath()));
    }

    /** 请求方法用错（例如对只支持 GET 的地址发 POST） */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<Map<String, Object>> handleMethodNotSupported(HttpRequestMethodNotSupportedException ex) {
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED)
                .body(body("该接口不支持 " + ex.getMethod() + " 请求"));
    }

    /** 路径变量类型不匹配，例如 /api/activities/abc */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, Object>> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        return ResponseEntity.badRequest()
                .body(body("参数 " + ex.getName() + " 格式不正确"));
    }

    /** 数据库异常：给出可执行的排查提示，同时把真实堆栈写进日志 */
    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<Map<String, Object>> handleDataAccess(DataAccessException ex) {
        log.error("数据库操作失败", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body(
                "数据库操作失败：请确认 MySQL 已启动、campus_activity 库已按 database/campus_activity.sql 初始化，" +
                        "并且 application.properties 中的账号密码正确。"));
    }

    /** 兜底：避免把 Tomcat 默认错误页暴露给前端 */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleUnexpected(Exception ex) {
        log.error("未处理的服务器异常", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(body("服务器内部错误：" + ex.getClass().getSimpleName()));
    }
}
