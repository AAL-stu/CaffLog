package com.cafflog.service;

import com.cafflog.dto.RecordRequest;
import com.cafflog.entity.IntakeRecord;
import com.cafflog.entity.User;
import com.cafflog.repository.IntakeRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecordService {

    private final IntakeRecordRepository recordRepository;

    @CacheEvict(value = "stats", allEntries = true)
    public IntakeRecord addRecord(User user, RecordRequest req) {
        IntakeRecord record = IntakeRecord.builder()
                .userId(user.getId())
                .recordType(req.getRecordType())
                .caffeineMg(req.getCaffeineMg())
                .beanName(req.getBeanName())
                .beanWeightG(req.getBeanWeightG())
                .methodName(req.getMethodName())
                .rangeMin(req.getRangeMin())
                .rangeMax(req.getRangeMax())
                .brandName(req.getBrandName())
                .drinkName(req.getDrinkName())
                .sizeName(req.getSizeName())
                .dataSource(req.getDataSource())
                .dataConfidence(req.getDataConfidence())
                .recordedAt(req.getRecordedAt() != null ? req.getRecordedAt() : Instant.now().toString())
                .build();
        return recordRepository.save(record);
    }

    public List<IntakeRecord> getAllRecords(Long userId) {
        return recordRepository.findByUserIdOrderByRecordedAtDesc(userId);
    }

    public List<IntakeRecord> getTodayRecords(Long userId) {
        String today = java.time.LocalDate.now().toString();
        String tomorrow = java.time.LocalDate.now().plusDays(1).toString();
        return recordRepository.findByUserIdAndDateRange(userId, today, tomorrow);
    }

    public int getTodayTotal(Long userId) {
        return getTodayRecords(userId).stream()
                .mapToInt(IntakeRecord::getCaffeineMg)
                .sum();
    }

    public long getTotalCount(Long userId) {
        return recordRepository.countByUserId(userId);
    }

    @CacheEvict(value = "stats", allEntries = true)
    public void deleteRecord(Long userId, Long recordId) {
        IntakeRecord record = recordRepository.findById(recordId)
                .orElseThrow(() -> new RuntimeException("记录不存在"));
        if (!record.getUserId().equals(userId)) {
            throw new RuntimeException("无权限删除此记录");
        }
        recordRepository.delete(record);
    }

    @CacheEvict(value = "stats", allEntries = true)
    public int clearAllRecords(Long userId) {
        List<IntakeRecord> records = recordRepository.findByUserIdOrderByRecordedAtDesc(userId);
        int count = records.size();
        recordRepository.deleteAll(records);
        return count;
    }

    public List<IntakeRecord> getRecordsByDateRange(Long userId, String start, String end) {
        return recordRepository.findByUserIdAndDateRangeInclusive(userId, start, end);
    }
}
