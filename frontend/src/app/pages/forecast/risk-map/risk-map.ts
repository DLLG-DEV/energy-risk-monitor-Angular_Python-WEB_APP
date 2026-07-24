import * as L from 'leaflet';
import { ForecastMapItem } from '../../../core/interfaces/forecast';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

const countryAliases: Record<string, string> = {
  Afghanistan: 'Afghanistan',
  'Akrotiri Sovereign Base Area': 'Akrotiri Sovereign Base Area',
  Aland: 'Åland',
  Albania: 'Albania',
  Algeria: 'Algeria',
  'American Samoa': 'American Samoa',
  Andorra: 'Andorra',
  Angola: 'Angola',
  Anguilla: 'Anguilla',
  Antarctica: 'Antarctica',
  'Antigua and Barbuda': 'Antigua and Barbuda',
  Argentina: 'Argentina',
  Armenia: 'Armenia',
  Aruba: 'Aruba',
  'Ashmore and Cartier Islands': 'Ashmore and Cartier Islands',
  Australia: 'Australia',
  Austria: 'Austria',
  Azerbaijan: 'Azerbaijan',
  Bahrain: 'Bahrain',
  'Bajo Nuevo Bank (Petrel Is.)': 'Bajo Nuevo Bank (Petrel Is.)',
  Bangladesh: 'Bangladesh',
  Barbados: 'Barbados',
  'Baykonur Cosmodrome': 'Baykonur Cosmodrome',
  Belarus: 'Belarus',
  Belgium: 'Belgium',
  Belize: 'Belize',
  Benin: 'Benin',
  Bermuda: 'Bermuda',
  Bhutan: 'Bhutan',
  'Bir Tawil': 'Bir Tawil',
  Bolivia: 'Bolivia',
  'Bosnia and Herzegovina': 'Bosnia and Herzegovina',
  Botswana: 'Botswana',
  Brazil: 'Brazil',
  'Brazilian Island': 'Brazilian Island',
  'British Indian Ocean Territory': 'British Indian Ocean Territory',
  'British Virgin Islands': 'British Virgin Islands',
  Brunei: 'Brunei',
  Bulgaria: 'Bulgaria',
  'Burkina Faso': 'Burkina Faso',
  Burundi: 'Burundi',
  'Cabo Verde': 'Cabo Verde',
  Cambodia: 'Cambodia',
  Cameroon: 'Cameroon',
  Canada: 'Canada',
  'Cayman Islands': 'Cayman Islands',
  'Central African Republic': 'Central African Republic',
  Chad: 'Chad',
  Chile: 'Chile',
  China: 'China',
  'Clipperton Island': 'Clipperton Island',
  Colombia: 'Colombia',
  Comoros: 'Comoros',
  'Cook Islands': 'Cook Islands',
  'Coral Sea Islands': 'Coral Sea Islands',
  'Costa Rica': 'Costa Rica',
  Croatia: 'Croatia',
  Cuba: 'Cuba',
  Curaçao: 'Curaçao',
  Cyprus: 'Cyprus',
  'Cyprus No Mans Area': 'Cyprus No Mans Area',
  Czechia: 'Czechia',
  'Democratic Republic of the Congo': 'Democratic Republic of the Congo',
  Denmark: 'Denmark',
  'Dhekelia Sovereign Base Area': 'Dhekelia Sovereign Base Area',
  Djibouti: 'Djibouti',
  Dominica: 'Dominica',
  'Dominican Republic': 'Dominican Republic',
  'East Timor': 'Timor-Leste',
  Ecuador: 'Ecuador',
  Egypt: 'Egypt',
  'El Salvador': 'El Salvador',
  'Equatorial Guinea': 'Equatorial Guinea',
  Eritrea: 'Eritrea',
  Estonia: 'Estonia',
  Ethiopia: 'Ethiopia',
  'Falkland Islands': 'Falkland Islands (Malvinas)',
  'Faroe Islands': 'Faroe Islands',
  'Federated States of Micronesia': 'Federated States of Micronesia',
  Fiji: 'Fiji',
  Finland: 'Finland',
  France: 'France',
  'French Polynesia': 'French Polynesia',
  'French Southern and Antarctic Lands': 'French Southern Territories',
  Gabon: 'Gabon',
  Gambia: 'Gambia',
  Georgia: 'Georgia',
  Germany: 'Germany',
  Ghana: 'Ghana',
  Gibraltar: 'Gibraltar',
  Greece: 'Greece',
  Greenland: 'Greenland',
  Grenada: 'Grenada',
  Guam: 'Guam',
  Guatemala: 'Guatemala',
  Guernsey: 'Guernsey',
  Guinea: 'Guinea',
  'Guinea-Bissau': 'Guinea-Bissau',
  Guyana: 'Guyana',
  Haiti: 'Haiti',
  'Heard Island and McDonald Islands': 'Heard Island and McDonald Islands',
  Honduras: 'Honduras',
  'Hong Kong S.A.R.': 'Hong Kong',
  Hungary: 'Hungary',
  Iceland: 'Iceland',
  India: 'India',
  'Indian Ocean Territories': 'Indian Ocean Territories',
  Indonesia: 'Indonesia',
  Iran: 'Iran',
  Iraq: 'Iraq',
  Ireland: 'Ireland',
  'Isle of Man': 'Isle of Man',
  Israel: 'Israel',
  Italy: 'Italy',
  'Ivory Coast': 'Ivory Coast',
  Jamaica: 'Jamaica',
  Japan: 'Japan',
  Jersey: 'Jersey',
  Jordan: 'Jordan',
  Kazakhstan: 'Kazakhstan',
  Kenya: 'Kenya',
  Kiribati: 'Kiribati',
  Kosovo: 'Kosovo',
  Kuwait: 'Kuwait',
  Kyrgyzstan: 'Kyrgyzstan',
  Laos: 'Laos',
  Latvia: 'Latvia',
  Lebanon: 'Lebanon',
  Lesotho: 'Lesotho',
  Liberia: 'Liberia',
  Libya: 'Libya',
  Liechtenstein: 'Liechtenstein',
  Lithuania: 'Lithuania',
  Luxembourg: 'Luxembourg',
  'Macao S.A.R': 'Macao',
  Madagascar: 'Madagascar',
  Malawi: 'Malawi',
  Malaysia: 'Malaysia',
  Maldives: 'Maldives',
  Mali: 'Mali',
  Malta: 'Malta',
  'Marshall Islands': 'Marshall Islands',
  Mauritania: 'Mauritania',
  Mauritius: 'Mauritius',
  Mexico: 'Mexico',
  Moldova: 'Moldova',
  Monaco: 'Monaco',
  Mongolia: 'Mongolia',
  Montenegro: 'Montenegro',
  Montserrat: 'Montserrat',
  Morocco: 'Morocco',
  Mozambique: 'Mozambique',
  Myanmar: 'Myanmar',
  Namibia: 'Namibia',
  Nauru: 'Nauru',
  Nepal: 'Nepal',
  Netherlands: 'Netherlands',
  'New Caledonia': 'New Caledonia',
  'New Zealand': 'New Zealand',
  Nicaragua: 'Nicaragua',
  Niger: 'Niger',
  Nigeria: 'Nigeria',
  Niue: 'Niue',
  'Norfolk Island': 'Norfolk Island',
  'North Korea': 'North Korea',
  'North Macedonia': 'North Macedonia',
  'Northern Cyprus': 'Northern Cyprus',
  'Northern Mariana Islands': 'Northern Mariana Islands',
  Norway: 'Norway',
  Oman: 'Oman',
  Pakistan: 'Pakistan',
  Palau: 'Palau',
  Palestine: 'Palestine',
  Panama: 'Panama',
  'Papua New Guinea': 'Papua New Guinea',
  Paraguay: 'Paraguay',
  Peru: 'Peru',
  Philippines: 'Philippines',
  'Pitcairn Islands': 'Pitcairn Islands',
  Poland: 'Poland',
  Portugal: 'Portugal',
  'Puerto Rico': 'Puerto Rico',
  Qatar: 'Qatar',
  'Republic of Serbia': 'Serbia',
  'Republic of the Congo': 'Republic of the Congo',
  Romania: 'Romania',
  Russia: 'Russia',
  Rwanda: 'Rwanda',
  'Saint Barthelemy': 'Saint Barthelemy',
  'Saint Helena': 'Saint Helena',
  'Saint Kitts and Nevis': 'Saint Kitts and Nevis',
  'Saint Lucia': 'Saint Lucia',
  'Saint Martin': 'Saint Martin',
  'Saint Pierre and Miquelon': 'Saint Pierre and Miquelon',
  'Saint Vincent and the Grenadines': 'Saint Vincent and the Grenadines',
  Samoa: 'Samoa',
  'San Marino': 'San Marino',
  'Saudi Arabia': 'Saudi Arabia',
  'Scarborough Reef': 'Scarborough Reef',
  Senegal: 'Senegal',
  'Serranilla Bank': 'Serranilla Bank',
  Seychelles: 'Seychelles',
  'Siachen Glacier': 'Siachen Glacier',
  'Sierra Leone': 'Sierra Leone',
  Singapore: 'Singapore',
  'Sint Maarten': 'Sint Maarten',
  Slovakia: 'Slovakia',
  Slovenia: 'Slovenia',
  'Solomon Islands': 'Solomon Islands',
  Somalia: 'Somalia',
  Somaliland: 'Somaliland',
  'South Africa': 'South Africa',
  'South Georgia and the Islands': 'South Georgia and the South Sandwich Islands',
  'South Korea': 'South Korea',
  'South Sudan': 'South Sudan',
  'Southern Patagonian Ice Field': 'Southern Patagonian Ice Field',
  Spain: 'Spain',
  'Spratly Islands': 'Spratly Islands',
  'Sri Lanka': 'Sri Lanka',
  Sudan: 'Sudan',
  Suriname: 'Suriname',
  Sweden: 'Sweden',
  Switzerland: 'Switzerland',
  Syria: 'Syria',
  'São Tomé and Principe': 'São Tomé and Principe',
  Taiwan: 'Taiwan',
  Tajikistan: 'Tajikistan',
  Thailand: 'Thailand',
  'The Bahamas': 'Bahamas',
  Togo: 'Togo',
  Tonga: 'Tonga',
  'Trinidad and Tobago': 'Trinidad and Tobago',
  Tunisia: 'Tunisia',
  Turkey: 'Turkey',
  Turkmenistan: 'Turkmenistan',
  'Turks and Caicos Islands': 'Turks and Caicos Islands',
  Tuvalu: 'Tuvalu',
  'US Naval Base Guantanamo Bay': 'US Naval Base Guantanamo Bay',
  Uganda: 'Uganda',
  Ukraine: 'Ukraine',
  'United Arab Emirates': 'United Arab Emirates',
  'United Kingdom': 'United Kingdom',
  'United Republic of Tanzania': 'Tanzania',
  'United States Minor Outlying Islands': 'United States Minor Outlying Islands',
  'United States Virgin Islands': 'United States Virgin Islands',
  'United States of America': 'United States',
  Uruguay: 'Uruguay',
  Uzbekistan: 'Uzbekistan',
  Vanuatu: 'Vanuatu',
  Vatican: 'Vatican',
  Venezuela: 'Venezuela',
  Vietnam: 'Vietnam',
  'Wallis and Futuna': 'Wallis and Futuna',
  'Western Sahara': 'Western Sahara',
  Yemen: 'Yemen',
  Zambia: 'Zambia',
  Zimbabwe: 'Zimbabwe',
  eSwatini: 'Eswatini',
};

@Component({
  selector: 'app-risk-map',
  standalone: true,
  imports: [],
  templateUrl: './risk-map.html',
  styleUrl: './risk-map.css',
})
export class RiskMap implements AfterViewInit, OnChanges {
  @Input()
  countries: ForecastMapItem[] = [];

  private map!: L.Map;
  private geoLayer!: L.GeoJSON;
  private geojsonData: any;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.createMap();
    this.loadGeoJson();
  }

  private createMap(): void {
    this.map = L.map('risk-map', {
      worldCopyJump: true,
      minZoom: 2,
      maxZoom: 6,
      zoomControl: true,
    }).setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(this.map);
  }

  private async loadGeoJson(): Promise<void> {
    const response = await fetch('assets/maps/countries.geojson');

    this.geojsonData = await response.json();

    this.drawCountries(this.geojsonData);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['countries'] && this.map && this.geojsonData) {
      this.drawCountries(this.geojsonData);
    }
  }

  private drawCountries(geojson: any): void {
    if (this.geoLayer) {
      this.map.removeLayer(this.geoLayer);
    }

    this.geoLayer = L.geoJSON(geojson, {
      style: (feature: any) => {
        const geoName = feature.properties.name;

        const item = this.countries.find(
          (x) => this.normalizeCountry(x.country ?? '') === this.normalizeCountry(geoName),
        );

        return {
          color: '#ffffff',
          weight: 1,
          fillOpacity: 0.75,
          fillColor: item ? this.getRiskColor(item.risk) : '#d1d5db',
        };
      },

      onEachFeature: (feature: any, layer: L.Layer) => {
        const item = this.countries.find(
          (x) =>
            this.normalizeCountry(x.country ?? '') ===
            this.normalizeCountry(feature.properties.name),
        );

        if (!item) {
          return;
        }

        (layer as L.Path).bindTooltip(
          `
            <div style="min-width:180px">
                <strong>${item.country}</strong>
                <hr>
                Región:
                ${item.region}
                <br>
                Eventos:
                ${item.expected_events}
                <br>
                Riesgo:
                <b>${item.risk}</b>
            </div>
            `,
        );
      },
    });
    this.geoLayer.addTo(this.map);
    this.cdr.detectChanges();
  }

  private getRiskColor(risk: string): string {
    switch (risk) {
      case 'LOW':
        return '#22C55E';
      case 'MEDIUM':
        return '# FACC15';
      case 'HIGH':
        return '#F97316';
      case 'CRITICAL':
        return '#DC2626';
      default:
        return '#CBD5E1';
    }
  }

  private normalizeCountry(country: string): string {
    if (!country) return '';

    const clean = country
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    return countryAliases[clean] ?? clean;
  }
}
