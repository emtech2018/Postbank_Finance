package co.ke.emtechhouse.eims.URAComponent.uralookups.currencies;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CurrenciesRepository extends JpaRepository<Currencies,Long> {
}
