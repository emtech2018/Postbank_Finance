package co.ke.emtechhouse.eims.URAComponent.SellerAndBasicDetails.basic;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostBankBasicDetailsRepository extends JpaRepository<PostBankBasicDetails,Long> {
}
