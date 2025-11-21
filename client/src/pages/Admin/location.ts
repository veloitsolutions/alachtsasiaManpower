// src/constants/locations.ts
interface CountryOption {
  value: string;
  label: {
    en: string;
    ar: string;
  };
  countryCode: string;
}

interface Province {
  value: string;
  label: {
    en: string;
    ar: string;
  };
}

interface City {
  value: string;
  label: {
    en: string;
    ar: string;
  };
}

interface ProvinceCityData {
  [country: string]: {
    provinces: Province[];
    citiesByProvince: {
      [province: string]: City[];
    };
  };
}


// Original primary countries (worker sourcing countries)
export const primaryCountriesData1: CountryOption[] = [
  { value: 'Philippines', label: { en: 'Philippines', ar: 'الفلبين' }, countryCode: '+63' },
  { value: 'Indonesia', label: { en: 'Indonesia', ar: 'إندونيسيا' }, countryCode: '+62' },
  { value: 'India', label: { en: 'India', ar: 'الهند' }, countryCode: '+91' },
  { value: 'Sri Lanka', label: { en: 'Sri Lanka', ar: 'سريلانكا' }, countryCode: '+94' },
  { value: 'Kenya', label: { en: 'Kenya', ar: 'كينيا' }, countryCode: '+254' },
  { value: 'Uganda', label: { en: 'Uganda', ar: 'أوغندا' }, countryCode: '+256' },
  { value: 'Nepal', label: { en: 'Nepal', ar: 'نيبال' }, countryCode: '+977' },
  { value: 'Bangladesh', label: { en: 'Bangladesh', ar: 'بنغلاديش' }, countryCode: '+880' },
  { value: 'Ethiopia', label: { en: 'Ethiopia', ar: 'إثيوبيا' }, countryCode: '+251' },
  { value: 'Ghana', label: { en: 'Ghana', ar: 'غانا' }, countryCode: '+233' }
];
// Second set of primary countries (GCC and Middle East focus)
export const primaryCountriesData2: CountryOption[] = [
  { value: 'Saudi Arabia', label: { en: 'Saudi Arabia', ar: 'المملكة العربية السعودية' }, countryCode: '+966' },
  { value: 'UAE', label: { en: 'UAE', ar: 'الإمارات العربية المتحدة' }, countryCode: '+971' },
  { value: 'Kuwait', label: { en: 'Kuwait', ar: 'الكويت' }, countryCode: '+965' },
  { value: 'Qatar', label: { en: 'Qatar', ar: 'قطر' }, countryCode: '+974' },
  { value: 'Bahrain', label: { en: 'Bahrain', ar: 'البحرين' }, countryCode: '+973' },
  { value: 'Oman', label: { en: 'Oman', ar: 'عمان' }, countryCode: '+968' },
  { value: 'Jordan', label: { en: 'Jordan', ar: 'الأردن' }, countryCode: '+962' },
  { value: 'Egypt', label: { en: 'Egypt', ar: 'مصر' }, countryCode: '+20' },
  { value: 'Lebanon', label: { en: 'Lebanon', ar: 'لبنان' }, countryCode: '+961' },
  { value: 'Iraq', label: { en: 'Iraq', ar: 'العراق' }, countryCode: '+964' }
];

// All other countries with country codes
export const allCountriesData: CountryOption[] = [
  { value: 'Afghanistan', label: { en: 'Afghanistan', ar: 'أفغانستان' }, countryCode: '+93' },
  { value: 'Albania', label: { en: 'Albania', ar: 'ألبانيا' }, countryCode: '+355' },
  { value: 'Algeria', label: { en: 'Algeria', ar: 'الجزائر' }, countryCode: '+213' },
  { value: 'Andorra', label: { en: 'Andorra', ar: 'أندورا' }, countryCode: '+376' },
  { value: 'Angola', label: { en: 'Angola', ar: 'أنغولا' }, countryCode: '+244' },
  { value: 'Antigua and Barbuda', label: { en: 'Antigua and Barbuda', ar: 'أنتيغوا وبربودا' }, countryCode: '+1-268' },
  { value: 'Argentina', label: { en: 'Argentina', ar: 'الأرجنتين' }, countryCode: '+54' },
  { value: 'Armenia', label: { en: 'Armenia', ar: 'أرمينيا' }, countryCode: '+374' },
  { value: 'Australia', label: { en: 'Australia', ar: 'أستراليا' }, countryCode: '+61' },
  { value: 'Austria', label: { en: 'Austria', ar: 'النمسا' }, countryCode: '+43' },
  { value: 'Azerbaijan', label: { en: 'Azerbaijan', ar: 'أذربيجان' }, countryCode: '+994' },
  { value: 'Bahamas', label: { en: 'Bahamas', ar: 'الباهاما' }, countryCode: '+1-242' },
  { value: 'Bahrain', label: { en: 'Bahrain', ar: 'البحرين' }, countryCode: '+973' },
  { value: 'Bangladesh', label: { en: 'Bangladesh', ar: 'بنغلاديش' }, countryCode: '+880' },
  { value: 'Barbados', label: { en: 'Barbados', ar: 'بربادوس' }, countryCode: '+1-246' },
  { value: 'Belarus', label: { en: 'Belarus', ar: 'بيلاروسيا' }, countryCode: '+375' },
  { value: 'Belgium', label: { en: 'Belgium', ar: 'بلجيكا' }, countryCode: '+32' },
  { value: 'Belize', label: { en: 'Belize', ar: 'بليز' }, countryCode: '+501' },
  { value: 'Benin', label: { en: 'Benin', ar: 'بنين' }, countryCode: '+229' },
  { value: 'Bhutan', label: { en: 'Bhutan', ar: 'بوتان' }, countryCode: '+975' },
  { value: 'Bolivia', label: { en: 'Bolivia', ar: 'بوليفيا' }, countryCode: '+591' },
  { value: 'Bosnia and Herzegovina', label: { en: 'Bosnia and Herzegovina', ar: 'البوسنة والهرسك' }, countryCode: '+387' },
  { value: 'Botswana', label: { en: 'Botswana', ar: 'بوتسوانا' }, countryCode: '+267' },
  { value: 'Brazil', label: { en: 'Brazil', ar: 'البرازيل' }, countryCode: '+55' },
  { value: 'Brunei', label: { en: 'Brunei', ar: 'بروناي' }, countryCode: '+673' },
  { value: 'Bulgaria', label: { en: 'Bulgaria', ar: 'بلغاريا' }, countryCode: '+359' },
  { value: 'Burkina Faso', label: { en: 'Burkina Faso', ar: 'بوركينا فاسو' }, countryCode: '+226' },
  { value: 'Burundi', label: { en: 'Burundi', ar: 'بوروندي' }, countryCode: '+257' },
  { value: 'Cabo Verde', label: { en: 'Cabo Verde', ar: 'كابو فيردي' }, countryCode: '+238' },
  { value: 'Cambodia', label: { en: 'Cambodia', ar: 'كمبوديا' }, countryCode: '+855' },
  { value: 'Cameroon', label: { en: 'Cameroon', ar: 'الكاميرون' }, countryCode: '+237' },
  { value: 'Canada', label: { en: 'Canada', ar: 'كندا' }, countryCode: '+1' },
  { value: 'Central African Republic', label: { en: 'Central African Republic', ar: 'جمهورية أفريقيا الوسطى' }, countryCode: '+236' },
  { value: 'Chad', label: { en: 'Chad', ar: 'تشاد' }, countryCode: '+235' },
  { value: 'Chile', label: { en: 'Chile', ar: 'تشيلي' }, countryCode: '+56' },
  { value: 'China', label: { en: 'China', ar: 'الصين' }, countryCode: '+86' },
  { value: 'Colombia', label: { en: 'Colombia', ar: 'كولومبيا' }, countryCode: '+57' },
  { value: 'Comoros', label: { en: 'Comoros', ar: 'جزر القمر' }, countryCode: '+269' },
  { value: 'Congo (Congo-Brazzaville)', label: { en: 'Congo (Congo-Brazzaville)', ar: 'الكونغو (برازافيل)' }, countryCode: '+242' },
  { value: 'Costa Rica', label: { en: 'Costa Rica', ar: 'كوستاريكا' }, countryCode: '+506' },
  { value: 'Côte d\'Ivoire', label: { en: 'Côte d\'Ivoire', ar: 'ساحل العاج' }, countryCode: '+225' },
  { value: 'Croatia', label: { en: 'Croatia', ar: 'كرواتيا' }, countryCode: '+385' },
  { value: 'Cuba', label: { en: 'Cuba', ar: 'كوبا' }, countryCode: '+53' },
  { value: 'Cyprus', label: { en: 'Cyprus', ar: 'قبرص' }, countryCode: '+357' },
  { value: 'Czech Republic', label: { en: 'Czech Republic', ar: 'التشيك' }, countryCode: '+420' },
  { value: 'Democratic Republic of the Congo', label: { en: 'Democratic Republic of the Congo', ar: 'جمهورية الكونغو الديمقراطية' }, countryCode: '+243' },
  { value: 'Denmark', label: { en: 'Denmark', ar: 'الدنمارك' }, countryCode: '+45' },
  { value: 'Djibouti', label: { en: 'Djibouti', ar: 'جيبوتي' }, countryCode: '+253' },
  { value: 'Dominica', label: { en: 'Dominica', ar: 'دومينيكا' }, countryCode: '+1-767' },
  { value: 'Dominican Republic', label: { en: 'Dominican Republic', ar: 'جمهورية الدومينيكان' }, countryCode: '+1' },
  { value: 'Ecuador', label: { en: 'Ecuador', ar: 'الإكوادور' }, countryCode: '+593' },
  { value: 'Egypt', label: { en: 'Egypt', ar: 'مصر' }, countryCode: '+20' },
  { value: 'El Salvador', label: { en: 'El Salvador', ar: 'السلفادور' }, countryCode: '+503' },
  { value: 'Equatorial Guinea', label: { en: 'Equatorial Guinea', ar: 'غينيا الاستوائية' }, countryCode: '+240' },
  { value: 'Eritrea', label: { en: 'Eritrea', ar: 'إريتريا' }, countryCode: '+291' },
  { value: 'Estonia', label: { en: 'Estonia', ar: 'إستونيا' }, countryCode: '+372' },
  { value: 'Eswatini', label: { en: 'Eswatini', ar: 'إسواتيني' }, countryCode: '+268' },
  { value: 'Ethiopia', label: { en: 'Ethiopia', ar: 'إثيوبيا' }, countryCode: '+251' },
  { value: 'Fiji', label: { en: 'Fiji', ar: 'فيجي' }, countryCode: '+679' },
  { value: 'Finland', label: { en: 'Finland', ar: 'فنلندا' }, countryCode: '+358' },
  { value: 'France', label: { en: 'France', ar: 'فرنسا' }, countryCode: '+33' },
  { value: 'Gabon', label: { en: 'Gabon', ar: 'غابون' }, countryCode: '+241' },
  { value: 'Gambia', label: { en: 'Gambia', ar: 'غامبيا' }, countryCode: '+220' },
  { value: 'Georgia', label: { en: 'Georgia', ar: 'جورجيا' }, countryCode: '+995' },
  { value: 'Germany', label: { en: 'Germany', ar: 'ألمانيا' }, countryCode: '+49' },
  { value: 'Ghana', label: { en: 'Ghana', ar: 'غانا' }, countryCode: '+233' },
  { value: 'Greece', label: { en: 'Greece', ar: 'اليونان' }, countryCode: '+30' },
  { value: 'Grenada', label: { en: 'Grenada', ar: 'غرينادا' }, countryCode: '+1-473' },
  { value: 'Guatemala', label: { en: 'Guatemala', ar: 'غواتيمالا' }, countryCode: '+502' },
  { value: 'Guinea', label: { en: 'Guinea', ar: 'غينيا' }, countryCode: '+224' },
  { value: 'Guinea-Bissau', label: { en: 'Guinea-Bissau', ar: 'غينيا بيساو' }, countryCode: '+245' },
  { value: 'Guyana', label: { en: 'Guyana', ar: 'غيانا' }, countryCode: '+592' },
  { value: 'Haiti', label: { en: 'Haiti', ar: 'هايتي' }, countryCode: '+509' },
  { value: 'Honduras', label: { en: 'Honduras', ar: 'هندوراس' }, countryCode: '+504' },
  { value: 'Hungary', label: { en: 'Hungary', ar: 'هنغاريا' }, countryCode: '+36' },
  { value: 'Iceland', label: { en: 'Iceland', ar: 'أيسلندا' }, countryCode: '+354' },
  { value: 'India', label: { en: 'India', ar: 'الهند' }, countryCode: '+91' },
  { value: 'Indonesia', label: { en: 'Indonesia', ar: 'إندونيسيا' }, countryCode: '+62' },
  { value: 'Iran', label: { en: 'Iran', ar: 'إيران' }, countryCode: '+98' },
  { value: 'Iraq', label: { en: 'Iraq', ar: 'العراق' }, countryCode: '+964' },
  { value: 'Ireland', label: { en: 'Ireland', ar: 'أيرلندا' }, countryCode: '+353' },
  { value: 'Israel', label: { en: 'Israel', ar: 'إسرائيل' }, countryCode: '+972' },
  { value: 'Italy', label: { en: 'Italy', ar: 'إيطاليا' }, countryCode: '+39' },
  { value: 'Jamaica', label: { en: 'Jamaica', ar: 'جامايكا' }, countryCode: '+1-876' },
  { value: 'Japan', label: { en: 'Japan', ar: 'اليابان' }, countryCode: '+81' },
  { value: 'Jordan', label: { en: 'Jordan', ar: 'الأردن' }, countryCode: '+962' },
  { value: 'Kazakhstan', label: { en: 'Kazakhstan', ar: 'كازاخستان' }, countryCode: '+7' },
  { value: 'Kenya', label: { en: 'Kenya', ar: 'كينيا' }, countryCode: '+254' },
  { value: 'Kiribati', label: { en: 'Kiribati', ar: 'كيريباتي' }, countryCode: '+686' },
  { value: 'Kuwait', label: { en: 'Kuwait', ar: 'الكويت' }, countryCode: '+965' },
  { value: 'Kyrgyzstan', label: { en: 'Kyrgyzstan', ar: 'قيرغيزستان' }, countryCode: '+996' },
  { value: 'Laos', label: { en: 'Laos', ar: 'لاوس' }, countryCode: '+856' },
  { value: 'Latvia', label: { en: 'Latvia', ar: 'لاتفيا' }, countryCode: '+371' },
  { value: 'Lebanon', label: { en: 'Lebanon', ar: 'لبنان' }, countryCode: '+961' },
  { value: 'Lesotho', label: { en: 'Lesotho', ar: 'ليسوتو' }, countryCode: '+266' },
  { value: 'Liberia', label: { en: 'Liberia', ar: 'ليبيريا' }, countryCode: '+231' },
  { value: 'Libya', label: { en: 'Libya', ar: 'ليبيا' }, countryCode: '+218' },
  { value: 'Liechtenstein', label: { en: 'Liechtenstein', ar: 'ليختنشتاين' }, countryCode: '+423' },
  { value: 'Lithuania', label: { en: 'Lithuania', ar: 'ليتوانيا' }, countryCode: '+370' },
  { value: 'Luxembourg', label: { en: 'Luxembourg', ar: 'لوكسمبورغ' }, countryCode: '+352' },
  { value: 'Madagascar', label: { en: 'Madagascar', ar: 'مدغشقر' }, countryCode: '+261' },
  { value: 'Malawi', label: { en: 'Malawi', ar: 'ملاوي' }, countryCode: '+265' },
  { value: 'Malaysia', label: { en: 'Malaysia', ar: 'ماليزيا' }, countryCode: '+60' },
  { value: 'Maldives', label: { en: 'Maldives', ar: 'جزر المالديف' }, countryCode: '+960' },
  { value: 'Mali', label: { en: 'Mali', ar: 'مالي' }, countryCode: '+223' },
  { value: 'Malta', label: { en: 'Malta', ar: 'مالطا' }, countryCode: '+356' },
  { value: 'Marshall Islands', label: { en: 'Marshall Islands', ar: 'جزر مارشال' }, countryCode: '+692' },
  { value: 'Mauritania', label: { en: 'Mauritania', ar: 'موريتانيا' }, countryCode: '+222' },
  { value: 'Mauritius', label: { en: 'Mauritius', ar: 'موريشيوس' }, countryCode: '+230' },
  { value: 'Mexico', label: { en: 'Mexico', ar: 'المكسيك' }, countryCode: '+52' },
  { value: 'Micronesia', label: { en: 'Micronesia', ar: 'ميكرونيزيا' }, countryCode: '+691' },
  { value: 'Moldova', label: { en: 'Moldova', ar: 'مولدوفا' }, countryCode: '+373' },
  { value: 'Monaco', label: { en: 'Monaco', ar: 'موناكو' }, countryCode: '+377' },
  { value: 'Mongolia', label: { en: 'Mongolia', ar: 'منغوليا' }, countryCode: '+976' },
  { value: 'Montenegro', label: { en: 'Montenegro', ar: 'الجبل الأسود' }, countryCode: '+382' },
  { value: 'Morocco', label: { en: 'Morocco', ar: 'المغرب' }, countryCode: '+212' },
  { value: 'Mozambique', label: { en: 'Mozambique', ar: 'موزمبيق' }, countryCode: '+258' },
  { value: 'Myanmar', label: { en: 'Myanmar', ar: 'ميانمار' }, countryCode: '+95' },
  { value: 'Namibia', label: { en: 'Namibia', ar: 'ناميبيا' }, countryCode: '+264' },
  { value: 'Nauru', label: { en: 'Nauru', ar: 'ناورو' }, countryCode: '+674' },
  { value: 'Nepal', label: { en: 'Nepal', ar: 'نيبال' }, countryCode: '+977' },
  { value: 'Netherlands', label: { en: 'Netherlands', ar: 'هولندا' }, countryCode: '+31' },
  { value: 'New Zealand', label: { en: 'New Zealand', ar: 'نيوزيلندا' }, countryCode: '+64' },
  { value: 'Nicaragua', label: { en: 'Nicaragua', ar: 'نيكاراغوا' }, countryCode: '+505' },
  { value: 'Niger', label: { en: 'Niger', ar: 'النيجر' }, countryCode: '+227' },
  { value: 'Nigeria', label: { en: 'Nigeria', ar: 'نيجيريا' }, countryCode: '+234' },
  { value: 'North Korea', label: { en: 'North Korea', ar: 'كوريا الشمالية' }, countryCode: '+850' },
  { value: 'North Macedonia', label: { en: 'North Macedonia', ar: 'مقدونيا الشمالية' }, countryCode: '+389' },
  { value: 'Norway', label: { en: 'Norway', ar: 'النرويج' }, countryCode: '+47' },
  { value: 'Oman', label: { en: 'Oman', ar: 'عمان' }, countryCode: '+968' },
  { value: 'Pakistan', label: { en: 'Pakistan', ar: 'باكستان' }, countryCode: '+92' },
  { value: 'Palau', label: { en: 'Palau', ar: 'بالاو' }, countryCode: '+680' },
  { value: 'Palestine', label: { en: 'Palestine', ar: 'فلسطين' }, countryCode: '+970' },
  { value: 'Panama', label: { en: 'Panama', ar: 'بنما' }, countryCode: '+507' },
  { value: 'Papua New Guinea', label: { en: 'Papua New Guinea', ar: 'بابوا غينيا الجديدة' }, countryCode: '+675' },
  { value: 'Paraguay', label: { en: 'Paraguay', ar: 'باراغواي' }, countryCode: '+595' },
  { value: 'Peru', label: { en: 'Peru', ar: 'بيرو' }, countryCode: '+51' },
  { value: 'Philippines', label: { en: 'Philippines', ar: 'الفلبين' }, countryCode: '+63' },
  { value: 'Poland', label: { en: 'Poland', ar: 'بولندا' }, countryCode: '+48' },
  { value: 'Portugal', label: { en: 'Portugal', ar: 'البرتغال' }, countryCode: '+351' },
  { value: 'Qatar', label: { en: 'Qatar', ar: 'قطر' }, countryCode: '+974' },
  { value: 'Romania', label: { en: 'Romania', ar: 'رومانيا' }, countryCode: '+40' },
  { value: 'Russia', label: { en: 'Russia', ar: 'روسيا' }, countryCode: '+7' },
  { value: 'Rwanda', label: { en: 'Rwanda', ar: 'رواندا' }, countryCode: '+250' },
  { value: 'Saint Kitts and Nevis', label: { en: 'Saint Kitts and Nevis', ar: 'سانت كيتس ونيفيس' }, countryCode: '+1-869' },
  { value: 'Saint Lucia', label: { en: 'Saint Lucia', ar: 'سانت لوسيا' }, countryCode: '+1-758' },
  { value: 'Saint Vincent and the Grenadines', label: { en: 'Saint Vincent and the Grenadines', ar: 'سانت فنسنت والغرينادين' }, countryCode: '+1-784' },
  { value: 'Samoa', label: { en: 'Samoa', ar: 'ساموا' }, countryCode: '+685' },
  { value: 'San Marino', label: { en: 'San Marino', ar: 'سان مارينو' }, countryCode: '+378' },
  { value: 'Sao Tome and Principe', label: { en: 'Sao Tome and Principe', ar: 'ساو تومي وبرينسيبي' }, countryCode: '+239' },
  { value: 'Saudi Arabia', label: { en: 'Saudi Arabia', ar: 'المملكة العربية السعودية' }, countryCode: '+966' },
  { value: 'Senegal', label: { en: 'Senegal', ar: 'السنغال' }, countryCode: '+221' },
  { value: 'Serbia', label: { en: 'Serbia', ar: 'صربيا' }, countryCode: '+381' },
  { value: 'Seychelles', label: { en: 'Seychelles', ar: 'سيشل' }, countryCode: '+248' },
  { value: 'Sierra Leone', label: { en: 'Sierra Leone', ar: 'سيراليون' }, countryCode: '+232' },
  { value: 'Singapore', label: { en: 'Singapore', ar: 'سنغافورة' }, countryCode: '+65' },
  { value: 'Slovakia', label: { en: 'Slovakia', ar: 'سلوفاكيا' }, countryCode: '+421' },
  { value: 'Slovenia', label: { en: 'Slovenia', ar: 'سلوفينيا' }, countryCode: '+386' },
  { value: 'Solomon Islands', label: { en: 'Solomon Islands', ar: 'جزر سليمان' }, countryCode: '+677' },
  { value: 'Somalia', label: { en: 'Somalia', ar: 'الصومال' }, countryCode: '+252' },
  { value: 'South Africa', label: { en: 'South Africa', ar: 'جنوب أفريقيا' }, countryCode: '+27' },
  { value: 'South Korea', label: { en: 'South Korea', ar: 'كوريا الجنوبية' }, countryCode: '+82' },
  { value: 'South Sudan', label: { en: 'South Sudan', ar: 'جنوب السودان' }, countryCode: '+211' },
  { value: 'Spain', label: { en: 'Spain', ar: 'إسبانيا' }, countryCode: '+34' },
  { value: 'Sri Lanka', label: { en: 'Sri Lanka', ar: 'سريلانكا' }, countryCode: '+94' },
  { value: 'Sudan', label: { en: 'Sudan', ar: 'السودان' }, countryCode: '+249' },
  { value: 'Suriname', label: { en: 'Suriname', ar: 'سورينام' }, countryCode: '+597' },
  { value: 'Sweden', label: { en: 'Sweden', ar: 'السويد' }, countryCode: '+46' },
  { value: 'Switzerland', label: { en: 'Switzerland', ar: 'سويسرا' }, countryCode: '+41' },
  { value: 'Syria', label: { en: 'Syria', ar: 'سوريا' }, countryCode: '+963' },
  { value: 'Taiwan', label: { en: 'Taiwan', ar: 'تايوان' }, countryCode: '+886' },
  { value: 'Tajikistan', label: { en: 'Tajikistan', ar: 'طاجيكستان' }, countryCode: '+992' },
  { value: 'Tanzania', label: { en: 'Tanzania', ar: 'تنزانيا' }, countryCode: '+255' },
  { value: 'Thailand', label: { en: 'Thailand', ar: 'تايلاند' }, countryCode: '+66' },
  { value: 'Timor-Leste', label: { en: 'Timor-Leste', ar: 'تيمور الشرقية' }, countryCode: '+670' },
  { value: 'Togo', label: { en: 'Togo', ar: 'توغو' }, countryCode: '+228' },
  { value: 'Tonga', label: { en: 'Tonga', ar: 'تونغا' }, countryCode: '+676' },
  { value: 'Trinidad and Tobago', label: { en: 'Trinidad and Tobago', ar: 'ترينيداد وتوباغو' }, countryCode: '+1-868' },
  { value: 'Tunisia', label: { en: 'Tunisia', ar: 'تونس' }, countryCode: '+216' },
  { value: 'Turkey', label: { en: 'Turkey', ar: 'تركيا' }, countryCode: '+90' },
  { value: 'Turkmenistan', label: { en: 'Turkmenistan', ar: 'تركمانستان' }, countryCode: '+993' },
  { value: 'Tuvalu', label: { en: 'Tuvalu', ar: 'توفالو' }, countryCode: '+688' },
  { value: 'Uganda', label: { en: 'Uganda', ar: 'أوغندا' }, countryCode: '+256' },
  { value: 'Ukraine', label: { en: 'Ukraine', ar: 'أوكرانيا' }, countryCode: '+380' },
  { value: 'United Arab Emirates', label: { en: 'United Arab Emirates', ar: 'الإمارات العربية المتحدة' }, countryCode: '+971' },
  { value: 'UAE', label: { en: 'UAE', ar: 'الإمارات العربية المتحدة' }, countryCode: '+971' },
  { value: 'United Kingdom', label: { en: 'United Kingdom', ar: 'المملكة المتحدة' }, countryCode: '+44' },
  { value: 'United States', label: { en: 'United States', ar: 'الولايات المتحدة الأمريكية' }, countryCode: '+1' },
  { value: 'Uruguay', label: { en: 'Uruguay', ar: 'أوروغواي' }, countryCode: '+598' },
  { value: 'Uzbekistan', label: { en: 'Uzbekistan', ar: 'أوزبكستان' }, countryCode: '+998' },
  { value: 'Vanuatu', label: { en: 'Vanuatu', ar: 'فانواتو' }, countryCode: '+678' },
  { value: 'Vatican City', label: { en: 'Vatican City', ar: 'الفاتيكان' }, countryCode: '+379' },
  { value: 'Venezuela', label: { en: 'Venezuela', ar: 'فنزويلا' }, countryCode: '+58' },
  { value: 'Vietnam', label: { en: 'Vietnam', ar: 'فيتنام' }, countryCode: '+84' },
  { value: 'Yemen', label: { en: 'Yemen', ar: 'اليمن' }, countryCode: '+967' },
  { value: 'Zambia', label: { en: 'Zambia', ar: 'زامبيا' }, countryCode: '+260' },
  { value: 'Zimbabwe', label: { en: 'Zimbabwe', ar: 'زيمبابوي' }, countryCode: '+263' }
];


// Helper function to combine all country data
export const getAllCountries = (): CountryOption[] => {
  return [...primaryCountriesData1, ...primaryCountriesData2, ...allCountriesData];
};


export const provinceCityData: ProvinceCityData = {
  'Saudi Arabia': {
    provinces: [
      { value: 'Riyadh', label: { en: 'Riyadh', ar: 'الرياض' } },
      { value: 'Makkah', label: { en: 'Makkah', ar: 'مكة المكرمة' } },
      { value: 'Madinah', label: { en: 'Madinah', ar: 'المدينة المنورة' } },
      { value: 'Eastern', label: { en: 'Eastern', ar: 'الشرقية' } },
      { value: 'Asir', label: { en: 'Asir', ar: 'عسير' } },
      { value: 'Jazan', label: { en: 'Jazan', ar: 'جازان' } },
      { value: 'Qassim', label: { en: 'Qassim', ar: 'القصيم' } },
      { value: 'Tabuk', label: { en: 'Tabuk', ar: 'تبوك' } },
      { value: 'Hail', label: { en: 'Hail', ar: 'حائل' } },
      { value: 'Najran', label: { en: 'Najran', ar: 'نجران' } },
      { value: 'Bahah', label: { en: 'Bahah', ar: 'الباحة' } },
      { value: 'Jawf', label: { en: 'Jawf', ar: 'الجوف' } },
      { value: 'Northern Borders', label: { en: 'Northern Borders', ar: 'الحدود الشمالية' } }
    ],
    citiesByProvince: {
      'Riyadh': [
        { value: 'Riyadh', label: { en: 'Riyadh', ar: 'الرياض' } },
        { value: 'Diriyah', label: { en: 'Diriyah', ar: 'الدرعية' } }
      ],
      'Makkah': [
        { value: 'Makkah', label: { en: 'Makkah', ar: 'مكة المكرمة' } },
        { value: 'Jeddah', label: { en: 'Jeddah', ar: 'جدة' } }
      ],
      'Madinah': [
        { value: 'Madinah', label: { en: 'Madinah', ar: 'المدينة المنورة' } }
      ],
      'Eastern': [
        { value: 'Dammam', label: { en: 'Dammam', ar: 'الدمام' } },
        { value: 'Khobar', label: { en: 'Khobar', ar: 'الخبر' } }
      ]
    }
  },
  'UAE': {
    provinces: [
      { value: 'Abu Dhabi', label: { en: 'Abu Dhabi', ar: 'أبو ظبي' } },
      { value: 'Dubai', label: { en: 'Dubai', ar: 'دبي' } },
      { value: 'Sharjah', label: { en: 'Sharjah', ar: 'الشارقة' } },
      { value: 'Ajman', label: { en: 'Ajman', ar: 'عجمان' } },
      { value: 'Umm Al Quwain', label: { en: 'Umm Al Quwain', ar: 'أم القيوين' } },
      { value: 'Ras Al Khaimah', label: { en: 'Ras Al Khaimah', ar: 'رأس الخيمة' } },
      { value: 'Fujairah', label: { en: 'Fujairah', ar: 'الفجيرة' } }
    ],
    citiesByProvince: {
      'Abu Dhabi': [
        { value: 'Abu Dhabi', label: { en: 'Abu Dhabi', ar: 'أبو ظبي' } },
        { value: 'Al Ain', label: { en: 'Al Ain', ar: 'العين' } }
      ],
      'Dubai': [
        { value: 'Dubai', label: { en: 'Dubai', ar: 'دبي' } }
      ],
      'Sharjah': [
        { value: 'Sharjah', label: { en: 'Sharjah', ar: 'الشارقة' } },
        { value: 'Khor Fakkan', label: { en: 'Khor Fakkan', ar: 'خورفكان' } }
      ]
    }
  },
  'Kuwait': {
    provinces: [
      { value: 'Al Asimah', label: { en: 'Al Asimah', ar: 'العاصمة' } },
      { value: 'Al Ahmadi', label: { en: 'Al Ahmadi', ar: 'الأحمدي' } },
      { value: 'Al Farwaniyah', label: { en: 'Al Farwaniyah', ar: 'الفروانية' } },
      { value: 'Al Jahra', label: { en: 'Al Jahra', ar: 'الجهراء' } },
      { value: 'Hawalli', label: { en: 'Hawalli', ar: 'حولي' } },
      { value: 'Mubarak Al Kabir', label: { en: 'Mubarak Al Kabir', ar: 'مبارك الكبير' } }
    ],
    citiesByProvince: {
      'Al Asimah': [
        { value: 'Kuwait City', label: { en: 'Kuwait City', ar: 'مدينة الكويت' } }
      ],
      'Al Ahmadi': [
        { value: 'Al Ahmadi', label: { en: 'Al Ahmadi', ar: 'الأحمدي' } }
      ]
    }
  },
  'Qatar': {
    provinces: [
      { value: 'Doha', label: { en: 'Doha', ar: 'الدوحة' } },
      { value: 'Al Rayyan', label: { en: 'Al Rayyan', ar: 'الريان' } },
      { value: 'Al Wakrah', label: { en: 'Al Wakrah', ar: 'الوكرة' } },
      { value: 'Al Khor', label: { en: 'Al Khor', ar: 'الخور' } },
      { value: 'Umm Salal', label: { en: 'Umm Salal', ar: 'أم صلال' } },
      { value: 'Al Daayen', label: { en: 'Al Daayen', ar: 'الضعاين' } },
      { value: 'Al Shamal', label: { en: 'Al Shamal', ar: 'الشمال' } }
    ],
    citiesByProvince: {
      'Doha': [
        { value: 'Doha', label: { en: 'Doha', ar: 'الدوحة' } }
      ],
      'Al Rayyan': [
        { value: 'Al Rayyan', label: { en: 'Al Rayyan', ar: 'الريان' } }
      ],
      'Al Wakrah': [
        { value: 'Al Wakrah', label: { en: 'Al Wakrah', ar: 'الوكرة' } }
      ]
    }
  },
  'Bahrain': {
    provinces: [
      { value: 'Manama', label: { en: 'Manama', ar: 'المنامة' } },
      { value: 'Muharraq', label: { en: 'Muharraq', ar: 'المحرق' } },
      { value: 'Northern', label: { en: 'Northern', ar: 'الشمالية' } },
      { value: 'Southern', label: { en: 'Southern', ar: 'الجنوبية' } }
    ],
    citiesByProvince: {
      'Manama': [
        { value: 'Manama', label: { en: 'Manama', ar: 'المنامة' } }
      ],
      'Muharraq': [
        { value: 'Muharraq', label: { en: 'Muharraq', ar: 'المحرق' } }
      ]
    }
  },
  'Oman': {
    provinces: [
      { value: 'Muscat', label: { en: 'Muscat', ar: 'مسقط' } },
      { value: 'Al Batinah North', label: { en: 'Al Batinah North', ar: 'الباطنة شمال' } },
      { value: 'Al Batinah South', label: { en: 'Al Batinah South', ar: 'الباطنة جنوب' } },
      { value: 'Ash Sharqiyah North', label: { en: 'Ash Sharqiyah North', ar: 'الشرقية شمال' } },
      { value: 'Ash Sharqiyah South', label: { en: 'Ash Sharqiyah South', ar: 'الشرقية جنوب' } },
      { value: 'Ad Dakhiliyah', label: { en: 'Ad Dakhiliyah', ar: 'الداخلية' } },
      { value: 'Dhofar', label: { en: 'Dhofar', ar: 'ظفار' } },
      { value: 'Al Wusta', label: { en: 'Al Wusta', ar: 'الوسطى' } },
      { value: 'Musandam', label: { en: 'Musandam', ar: 'مسندم' } }
    ],
    citiesByProvince: {
      'Muscat': [
        { value: 'Muscat', label: { en: 'Muscat', ar: 'مسقط' } }
      ],
      'Al Batinah North': [
        { value: 'Sohar', label: { en: 'Sohar', ar: 'صحار' } }
      ]
    }
  },
  'Jordan': {
    provinces: [
      { value: 'Amman', label: { en: 'Amman', ar: 'عمان' } },
      { value: 'Irbid', label: { en: 'Irbid', ar: 'إربد' } },
      { value: 'Zarqa', label: { en: 'Zarqa', ar: 'الزرقاء' } }
    ],
    citiesByProvince: {
      'Amman': [
        { value: 'Amman', label: { en: 'Amman', ar: 'عمان' } }
      ],
      'Irbid': [
        { value: 'Irbid', label: { en: 'Irbid', ar: 'إربد' } }
      ]
    }
  },
  'Egypt': {
    provinces: [
      { value: 'Cairo', label: { en: 'Cairo', ar: 'القاهرة' } },
      { value: 'Alexandria', label: { en: 'Alexandria', ar: 'الإسكندرية' } }
    ],
    citiesByProvince: {
      'Cairo': [
        { value: 'Cairo', label: { en: 'Cairo', ar: 'القاهرة' } }
      ],
      'Alexandria': [
        { value: 'Alexandria', label: { en: 'Alexandria', ar: 'الإسكندرية' } }
      ]
    }
  },
  'Lebanon': {
    provinces: [
      { value: 'Beirut', label: { en: 'Beirut', ar: 'بيروت' } },
      { value: 'Mount Lebanon', label: { en: 'Mount Lebanon', ar: 'جبل لبنان' } }
    ],
    citiesByProvince: {
      'Beirut': [
        { value: 'Beirut', label: { en: 'Beirut', ar: 'بيروت' } }
      ],
      'Mount Lebanon': [
        { value: 'Jounieh', label: { en: 'Jounieh', ar: 'جونيه' } }
      ]
    }
  },
  'Iraq': {
    provinces: [
      { value: 'Baghdad', label: { en: 'Baghdad', ar: 'بغداد' } },
      { value: 'Basra', label: { en: 'Basra', ar: 'البصرة' } }
    ],
    citiesByProvince: {
      'Baghdad': [
        { value: 'Baghdad', label: { en: 'Baghdad', ar: 'بغداد' } }
      ],
      'Basra': [
        { value: 'Basra', label: { en: 'Basra', ar: 'البصرة' } }
      ]
    }
  }
};
