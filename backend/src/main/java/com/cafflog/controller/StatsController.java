package com.cafflog.controller;

import com.cafflog.dto.ApiResponse;
import com.cafflog.dto.StatsResponse;
import com.cafflog.entity.User;
import com.cafflog.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatsController {

    private final StatsService statsService;

    @GetMapping("/daily")
    public ApiResponse<List<StatsResponse>> getDailyTrend(@AuthenticationPrincipal User user,
                                                           @RequestParam(defaultValue = "7") int days) {
        return ApiResponse.ok(statsService.getDailyTrend(user.getId(), days));
    }

    @GetMapping("/weekly")
    public ApiResponse<List<StatsResponse>> getWeeklyTrend(@AuthenticationPrincipal User user) {
        return ApiResponse.ok(statsService.getWeeklyTrend(user.getId()));
    }

    @GetMapping("/monthly")
    public ApiResponse<List<StatsResponse>> getMonthlyTrend(@AuthenticationPrincipal User user) {
        return ApiResponse.ok(statsService.getMonthlyTrend(user.getId()));
    }
}
