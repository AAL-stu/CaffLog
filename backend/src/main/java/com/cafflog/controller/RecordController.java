package com.cafflog.controller;

import com.cafflog.dto.ApiResponse;
import com.cafflog.dto.RecordRequest;
import com.cafflog.entity.IntakeRecord;
import com.cafflog.entity.User;
import com.cafflog.service.RecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/records")
@RequiredArgsConstructor
public class RecordController {

    private final RecordService recordService;

    @PostMapping
    public ApiResponse<Map<String, Object>> addRecord(@AuthenticationPrincipal User user,
                                                       @Valid @RequestBody RecordRequest request) {
        IntakeRecord record = recordService.addRecord(user, request);
        Map<String, Object> data = new HashMap<>();
        data.put("id", record.getId());
        data.put("success", true);
        return ApiResponse.ok(data);
    }

    @GetMapping("/today")
    public ApiResponse<List<IntakeRecord>> getTodayRecords(@AuthenticationPrincipal User user) {
        return ApiResponse.ok(recordService.getTodayRecords(user.getId()));
    }

    @GetMapping("/today/total")
    public ApiResponse<Map<String, Object>> getTodayTotal(@AuthenticationPrincipal User user) {
        int total = recordService.getTodayTotal(user.getId());
        List<IntakeRecord> records = recordService.getTodayRecords(user.getId());
        Map<String, Object> data = new HashMap<>();
        data.put("total", total);
        data.put("count", records.size());
        return ApiResponse.ok(data);
    }

    @GetMapping("/count")
    public ApiResponse<Map<String, Object>> getTotalCount(@AuthenticationPrincipal User user) {
        long count = recordService.getTotalCount(user.getId());
        Map<String, Object> data = new HashMap<>();
        data.put("total", count);
        return ApiResponse.ok(data);
    }

    @GetMapping
    public ApiResponse<List<IntakeRecord>> getAllRecords(@AuthenticationPrincipal User user) {
        return ApiResponse.ok(recordService.getAllRecords(user.getId()));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteRecord(@AuthenticationPrincipal User user,
                                           @PathVariable Long id) {
        recordService.deleteRecord(user.getId(), id);
        return ApiResponse.ok(null);
    }

    @DeleteMapping("/clear")
    public ApiResponse<Map<String, Object>> clearAllRecords(@AuthenticationPrincipal User user) {
        int removed = recordService.clearAllRecords(user.getId());
        Map<String, Object> data = new HashMap<>();
        data.put("removed", removed);
        return ApiResponse.ok(data);
    }
}
