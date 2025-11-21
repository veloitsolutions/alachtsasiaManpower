interface Option {
  value: string;
  label: {
    en: string;
    ar: string;
  };
}

export const jobTypes: Option[] = [
  { value: 'full-time', label: { en: 'Full-time', ar: 'دوام كامل' } },
  { value: 'part-Time', label: { en: 'Part-time', ar: 'دوام جزئي' } },
  { value: 'hourlybasis', label: { en: 'Hourly Basis', ar: 'على أساس كل ساعة' } },
  { value: 'temporary', label: { en: 'Temporary', ar: 'مؤقت' } },
  { value: 'permanent', label: { en: 'Permanent', ar: 'دائم' } },
  { value: 'internship', label: { en: 'Internship', ar: 'تدريب' } },
  { value: 'contractual', label: { en: 'Contractual', ar: 'تعاقدي' } },
  { value: 'freelance', label: { en: 'Freelance', ar: 'عمل حر' } },
  { value: 'volunteer', label: { en: 'Volunteer', ar: 'تطوع' } },
  { value: 'fresher', label: { en: 'Fresher', ar: 'مبتدئ' } }
];

export const genders: Option[] = [
  { value: 'Male', label: { en: 'Male', ar: 'ذكر' } },
  { value: 'Female', label: { en: 'Female', ar: 'أنثى' } },
  { value: 'Other', label: { en: 'Other', ar: 'آخر' } }
];

export const maritalStatuses: Option[] = [
  { value: 'SingleMother', label: { en: 'Single Mother', ar: 'أم عزباء' } },
  { value: 'Married', label: { en: 'Married', ar: 'متزوج' } },
  { value: 'Divorcee', label: { en: 'Divorcee', ar: 'مطلق' } },
  { value: 'Widow', label: { en: 'Widow', ar: 'أرمل' } },
  { value: 'Separated', label: { en: 'Separated', ar: 'منفصل' } },
  { value: 'Single', label: { en: 'Single', ar: 'أعزب' } },
];

export const jobTitles: Option[] = [
  { value: 'cook', label: { en: 'Cook', ar: 'طباخ' } },
  { value: 'caregiver', label: { en: 'Caregiver', ar: 'مقدم رعاية' } },
  { value: 'driver', label: { en: 'Driver', ar: 'سائق' } },
  { value: 'nurse', label: { en: 'Nurse', ar: 'ممرض' } },
  { value: 'doctor', label: { en: 'Doctor', ar: 'طبيب' } },
  { value: 'teacher', label: { en: 'Teacher', ar: 'معلم' } },
  { value: 'nanny', label: { en: 'Nanny', ar: 'مربية' } },
  { value: 'babySitter', label: { en: 'Baby Sitter', ar: 'جليسة أطفال' } },
  { value: 'gardener', label: { en: 'Gardener', ar: 'بستاني' } },
  { value: 'houseboy', label: { en: 'Houseboy', ar: 'عامل منزلي' } },
  { value: 'domesticHelper', label: { en: 'Domestic Helper', ar: 'مساعد منزلي' } },
  { value: 'securityGuard', label: { en: 'Security Guard', ar: 'حارس أمن' } },
  { value: 'clearing-worker', label: { en: 'Clearing Worker', ar: 'عامل تنظيف' } },
  { value: 'masseurs', label: { en: 'Masseurs', ar: 'مدلك' } },
  { value: 'housekeeper', label: { en: 'Housekeeper', ar: 'مدبر منزل' } },
  { value: 'handyBoy', label: { en: 'Handy Boy', ar: 'عامل صيانة' } },
  { value: 'butler', label: { en: 'Butler', ar: 'خادم' } },
  { value: 'laundryWorker', label: { en: 'Laundry Worker', ar: 'عامل مغسلة' } },
  { value: 'beautician', label: { en: 'Beautician', ar: 'خبير تجميل' } },
  { value: 'tailor', label: { en: 'Tailor', ar: 'خياط' } },
  { value: 'maid', label: { en: 'Maid', ar: 'خادمة' } },
  { value: 'hairDresser', label: { en: 'Hair Dresser', ar: 'مصفف شعر' } },
  { value: 'secretary', label: { en: 'Secretary', ar: 'سكرتير' } },
  { value: 'gymTrainer', label: { en: 'Gym Trainer', ar: 'مدرب رياضي' } },
  { value: 'swimmingTrainer', label: { en: 'Swimming Trainer', ar: 'مدرب سباحة' } },
  { value: 'elderCare', label: { en: 'Elder Care', ar: 'رعاية المسنين' } },
  { value: 'housemaid', label: { en: 'Housemaid', ar: 'خادمة' } },
  { value: 'personalAssistant', label: { en: 'Personal Assistant', ar: 'مساعد شخصي' } },
  { value: 'elderCareCompanion', label: { en: 'Elder Care Companion', ar: 'رفيق لرعاية المسنين' } },
  { value: 'petSitter', label: { en: 'Pet Sitter/Dog Walker', ar: 'جالس حيوانات أليفة/مشاة كلاب' } },
  { value: 'houseManager', label: { en: 'House Manager', ar: 'مدير منزل' } },
  { value: 'maintenanceWorker', label: { en: 'Maintenance Worker/Handyman', ar: 'عامل صيانة/يدوي' } },
  { value: 'tutor', label: { en: 'Tutor', ar: 'مدرس خصوصي' } },
  { value: 'chauffeur', label: { en: 'Chauffeur', ar: 'سائق خاص' } },
  { value: 'kitchenStaff', label: { en: 'Kitchen Staff', ar: 'طاقم المطبخ' } },
  { value: 'diningRoomAttendant', label: { en: 'Dining Room Attendant', ar: 'نادل غرفة الطعام' } },
  { value: 'personalChef', label: { en: 'Personal Chef', ar: 'شيف شخصي' } },
  { value: 'eventCoordinator', label: { en: 'Event Coordinator', ar: 'منسق فعاليات' } },
  { value: 'householdAdministrator', label: { en: 'Household Administrator', ar: 'مدير منزلي' } },
  { value: 'domesticAssistant', label: { en: 'Domestic Assistant', ar: 'مساعد منزلي' } },
  { value: 'electrician', label: { en: 'Electrician', ar: 'كهربائي' } },
  { value: 'plumber', label: { en: 'Plumber', ar: 'سباك' } },
  { value: 'marketingExecutive', label: { en: 'Marketing Executive', ar: 'مدير تسويق' } },
  { value: 'motorBikeDriver', label: { en: 'Motor Bike Driver', ar: 'سائق دراجة نارية' } }
];

export const workerCategories: Option[] = [
  { value: 'domestic', label: { en: 'Domestic Worker', ar: 'عامل منزلي' } },
  { value: 'recruitment', label: { en: 'Recruitment worker', ar: 'عامل توظيف' } },
  { value: 'returned', label: { en: 'Returned labor', ar: 'عمالة عائدة' } },
  { value: 'monthly', label: { en: 'Monthly contract labor', ar: 'عمالة عقود شهرية' } },
  { value: 'multi skilled labour', label: { en: 'Multi Skilled Labour', ar: 'عمال متعدد المهارات' } },
  { value: 'company worker', label: { en: 'Company Worker', ar: 'عمال محترفون' } }
];

export const companyWorkerTypes: Option[] = [
  { value: 'cleaning', label: { en: 'Cleaning', ar: 'تنظيف' } },
  { value: 'hospitality', label: { en: 'Hospitality', ar: 'ضيافة' } },
  { value: 'hospital', label: { en: 'Hospital', ar: 'مستشفى' } },
  { value: 'securityGuard', label: { en: 'Security Guard', ar: 'حارس أمن' } },
  { value: 'femaleSecretary', label: { en: 'Female Secretary', ar: 'سكرتيرة' } },
  { value: 'multiSkilled', label: { en: 'Multi-Skilled Company Worker', ar: 'عامل شركة متعدد المهارات' } },
  { value: 'driver', label: { en: 'Driver', ar: 'سائق' } },
  { value: 'farmWorkers', label: { en: 'Farm Workers', ar: 'عمال مزرعة' } },
  { value: 'motorBikeDriver', label: { en: 'Motor Bike Driver', ar: 'سائق دراجة نارية' } }
];

export const religionsData: Option[] = [
  { value: 'Muslim', label: { en: 'Muslim', ar: 'الإسلام' } },
  { value: 'Christian', label: { en: 'Christian', ar: 'المسيحية' } },
  { value: 'Hindu', label: { en: 'Hindu', ar: 'الهندوسية' } },
  { value: 'Buddhist', label: { en: 'Buddhist', ar: 'البوذية' } },
  { value: 'Other', label: { en: 'Other', ar: 'آخر' } }
];

export const horoscopeOptions: Option[] = [
  { value: 'Aries', label: { en: 'Aries', ar: 'الحمل' } },
  { value: 'Taurus', label: { en: 'Taurus', ar: 'الثور' } },
  { value: 'Gemini', label: { en: 'Gemini', ar: 'الجوزاء' } },
  { value: 'Cancer', label: { en: 'Cancer', ar: 'السرطان' } },
  { value: 'Leo', label: { en: 'Leo', ar: 'الأسد' } },
  { value: 'Virgo', label: { en: 'Virgo', ar: 'العذراء' } },
  { value: 'Libra', label: { en: 'Libra', ar: 'الميزان' } },
  { value: 'Scorpio', label: { en: 'Scorpio', ar: 'العقرب' } },
  { value: 'Sagittarius', label: { en: 'Sagittarius', ar: 'القوس' } },
  { value: 'Capricorn', label: { en: 'Capricorn', ar: 'الجدي' } },
  { value: 'Aquarius', label: { en: 'Aquarius', ar: 'الدلو' } },
  { value: 'Pisces', label: { en: 'Pisces', ar: 'الحوت' } },
];
