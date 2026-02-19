package com.adorsys.fineract.gateway.repository;

import com.adorsys.fineract.gateway.entity.ReversalDeadLetter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReversalDeadLetterRepository extends JpaRepository<ReversalDeadLetter, Long> {

    List<ReversalDeadLetter> findByResolvedFalseOrderByCreatedAtAsc();

    long countByResolvedFalse();
}
