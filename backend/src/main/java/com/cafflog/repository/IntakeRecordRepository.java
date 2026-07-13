package com.cafflog.repository;

import com.cafflog.entity.IntakeRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface IntakeRecordRepository extends JpaRepository<IntakeRecord, Long> {

    List<IntakeRecord> findByUserIdOrderByRecordedAtDesc(Long userId);

    @Query("SELECT r FROM IntakeRecord r WHERE r.userId = :userId AND r.recordedAt >= :start AND r.recordedAt < :end ORDER BY r.recordedAt DESC")
    List<IntakeRecord> findByUserIdAndDateRange(@Param("userId") Long userId,
                                                 @Param("start") String start,
                                                 @Param("end") String end);

    @Query("SELECT r FROM IntakeRecord r WHERE r.userId = :userId AND r.recordedAt >= :start AND r.recordedAt <= :end ORDER BY r.recordedAt ASC")
    List<IntakeRecord> findByUserIdAndDateRangeInclusive(@Param("userId") Long userId,
                                                          @Param("start") String start,
                                                          @Param("end") String end);

    long countByUserId(Long userId);

    void deleteByUserId(Long userId);
}
