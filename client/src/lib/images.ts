const BUCKET = "_public";
const FOLDER = "images";

function getImageUrl(filename: string): string {
  return `/storage/${BUCKET}/${FOLDER}/${filename}`;
}

export const images = {
  happySeniorsReceivingGift: getImageUrl("happy_seniors_receiving_gift.png"),
  smilingOfficeWorkersTeam: getImageUrl("smiling_office_workers_team.png"),
  koreanHealthGiftSet: getImageUrl("korean_health_gift_set.png"),
  customerServiceRepresentativeHeadset: getImageUrl("customer_service_representative_headset.png"),
  happyKoreanSeniorsOpeningLuxuryGiftBox: getImageUrl("happy_korean_seniors_opening_luxury_gift_box.png"),
  smartphoneShowingCaringMessageNotification: getImageUrl("smartphone_showing_caring_message_notification.png"),
  premiumKoreanHealthGiftBoxComposition: getImageUrl("premium_korean_health_gift_box_composition.png"),
  premiumKoreanHealthGiftBox: getImageUrl("premium_korean_health_gift_box.png"),
  koreanRedGinsengRoots: getImageUrl("korean_red_ginseng_roots.png"),
  heartHealthSupplements: getImageUrl("heart_health_supplements.png"),
  vitaminSupplementsPills: getImageUrl("vitamin_supplements_pills.png"),
  freshFruitGiftBasket: getImageUrl("fresh_fruit_gift_basket.png"),
  luxuryCosmeticsSkincareSet: getImageUrl("luxury_cosmetics_skincare_set.png"),
  sleepHealthSupplements: getImageUrl("sleep_health_supplements.png"),
  koreanTeaSet: getImageUrl("korean_tea_set.png"),
  jointHealthSupplements: getImageUrl("joint_health_supplements.png"),
  cuteDogAndCatTogether: getImageUrl("cute_dog_and_cat_together.png"),
  dailyToiletriesProducts: getImageUrl("daily_toiletries_products.png"),
  premiumLuxuryGiftBox: getImageUrl("premium_luxury_gift_box.png"),
  seniorsHealthTourEvent: getImageUrl("seniors_health_tour_event.png"),
  koreanRedGinsengJeonggwa: getImageUrl("korean_red_ginseng_jeonggwa.png"),
  koreanDriedJujubeChips: getImageUrl("korean_dried_jujube_chips.png"),
  organicWalnutsInBowl: getImageUrl("organic_walnuts_in_bowl.png"),
  happySeniorsOpeningGiftBox: getImageUrl("happy_seniors_opening_gift_box.png"),
  koreanTempleAutumnTravel: getImageUrl("korean_temple_autumn_travel.png"),
  modernWellnessCompanyHq: getImageUrl("modern_wellness_company_hq.png"),
  seniorRehabTherapyEquipment: getImageUrl("senior_rehab_therapy_equipment.png"),
  luxuryKoreanHealthGiftSet: getImageUrl("luxury_korean_health_gift_set.png"),
  koreanLuckyPouchBokjumeoni: getImageUrl("korean_lucky_pouch_bokjumeoni.png"),
  traditionalKoreanHangwaCookies: getImageUrl("traditional_korean_hangwa_cookies.png"),
  energyBoostingSupplements: getImageUrl("energy_boosting_supplements.png"),
  petCareHealthProducts: getImageUrl("pet_care_health_products.png"),
  organicGradientHealthBackground: getImageUrl("organic_gradient_health_background.png"),
  vitaminDAndCSupplements: getImageUrl("vitamin_d_and_c_supplements.png"),
};
