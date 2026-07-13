package com.cafflog.service;

import com.cafflog.dto.StatsResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final RecordService recordService;

    @Cacheable(value = "stats", key = "'daily:' + #userId + ':' + #days")
    public List<StatsResponse> getDailyTrend(Long userId, int days) {
        return computeDailyTrend(userId, days);
    }

    @Cacheable(value = "stats", key = "'weekly:' + #userId")
    public List<StatsResponse> getWeeklyTrend(Long userId) {
        return computeDailyTrend(userId, 7);
    }

    @Cacheable(value = "stats", key = "'monthly:' + #userId")
    public List<StatsResponse> getMonthlyTrend(Long userId) {
        LocalDate today = LocalDate.now();
        LocalDate firstDay = today.withDayOfMonth(1);
        int days = (int) (today.toEpochDay() - firstDay.toEpochDay()) + 1;
        return computeDailyTrend(userId, days);
    }

    private List<StatsResponse> computeDailyTrend(Long userId, int days) {
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(days - 1);

        List<StatsResponse> allDays = new ArrayList<>();
        for (LocalDate d = start; !d.isAfter(end); d = d.plusDays(1)) {
            allDays.add(StatsResponse.builder().date(d.toString()).total(0).count(0).build());
        }

        Map<String, StatsResponse> map = new LinkedHashMap<>();
        for (StatsResponse sr : allDays) {
            map.put(sr.getDate(), sr);
        }

        var records = recordService.getRecordsByDateRange(userId, start.toString(), end.toString());
        for (var r : records) {
            String date = r.getRecordedAt().split("T")[0];
            StatsResponse sr = map.get(date);
            if (sr != null) {
                sr.setTotal(sr.getTotal() + r.getCaffeineMg());
                sr.setCount(sr.getCount() + 1);
            }
        }

        return new ArrayList<>(map.values());
    }
}
