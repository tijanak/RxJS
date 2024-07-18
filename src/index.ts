import { Observable } from "rxjs";
import { differenceInMinutes } from "date-fns";
import { TravelTimeClient } from "traveltime-api";
import { createElements, drawNewRequestForm } from "./views/requestFormUI";
import { makeRequestObs } from "./controllers/observables";
import { getDistanceInKm } from "./models/ILocation";

let locationInputs: HTMLInputElement[] = [];
let nameInput: HTMLInputElement = document.createElement("input");
let formBtn: HTMLButtonElement = document.createElement("button");
createElements(locationInputs);
drawNewRequestForm(document.body, locationInputs, nameInput, formBtn);
makeRequestObs(locationInputs, nameInput, formBtn);

/*console.log(
  getDistanceInKm(
    { latitude: 43.315171374964976, longitude: 21.91652238674348 },
    { latitude: 43.324268120690455, longitude: 21.90883842550084 }
  )
);*/
/*travelTimeClient
  .geocoding("Mike Alasa 9", {
    acceptLanguage: "en-US",
    params: {
      limit: 1,
      bounds: {
        southEast: { lat: 43.2, lng: 22.3 },
        northWest: { lat: 43.5, lng: 21.5 },
      },
    },
  })
  .then((data) => {
    if (data.features.length > 0)
      console.log(data.features[0].geometry.coordinates);
  })
  .catch((e) => console.error(e));*/
let d = new Date("2024-07-17T14:46:31+02:00");
let ad = new Date("2024-07-17T14:58:28+02:00");
var diff = Math.abs(ad.getTime() - d.getTime());
var minutes = Math.floor(diff / 1000 / 60);
var test = Math.abs(differenceInMinutes(ad, d));
console.log(minutes);
console.log(test);
//https://geocode.maps.co/search?q=Kneginje Milice 15-5, Niš&api_key=6696ee4beaedc996202413lba53bfe7
/*{
  "type": "FeatureCollection",
  "attribution": "https://docs.traveltime.com/api/reference/geocoding-attribution",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          21.8919514,
          43.3313486
        ]
      },
      "properties": {
        "name": "Електронски факултет, 14, Александра Медведева, Насеље Стеван Синђелић, Ниш (Црвени Крст), Градска општина Црвени Крст, City of Niš, Nisava Administrative District, Central Serbia, 18000, Serbia",
        "label": "Електронски факултет, 14, Александра Медведева, Насеље Стеван Синђелић, Ниш (Црвени Крст), Градска општина Црвени Крст, City of Niš, Nisava Administrative District, Central Serbia, 18000, Serbia",
        "category": "amenity",
        "type": "college",
        "score": 0.00001,
        "house_number": "14",
        "street": "Александра Медведева",
        "neighbourhood": "Насеље Стеван Синђелић",
        "county": "Nisava Administrative District",
        "macroregion": "Central Serbia",
        "city": "City of Niš",
        "district": "Ниш (Црвени Крст)",
        "country": "Serbia",
        "country_code": "SRB",
        "postcode": "18000",
        "features": {
          "public_transport": {
            "date_start": "2024-06-29T00:00:00+02:00",
            "date_end": "2024-09-01T00:00:00+02:00"
          },
          "cross_country_modes": [],
          "fares": false,
          "postcodes": false
        }
      }
    }
  ]
} */
//https://api.traveltimeapp.com/v4/routes?type=driving&origin_lat=43.331561&origin_lng=21.931582&destination_lat=43.3313486&destination_lng=21.8919514&departure_time=2024-07-17T12:46:31.395Z&app_id=d94dd299&api_key=41ceea9b928ed1d576beb30b65b28c31
//https://api.traveltimeapp.com/v4/geocoding/search?query=London&limit=10&format.name=false&format.exclude.country=false&bounds=43%2C22.5%2C43.5%2C21.5&app_id=d94dd299&api_key=41ceea9b928ed1d576beb30b65b28c31
//https://api.traveltimeapp.com/v4/geocoding/search?query=London&limit=10&format.name=false&format.exclude.country=false&bounds=43.4%2C22%2C43.25%2C21.8
/*[{"place_id":50379469,"licence":"Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright","osm_type":"way","osm_id":115561093,"boundingbox":["43.3296538","43.3331594","21.931489","21.931668"],"lat":"43.331561","lon":"21.931582","display_name":"Кнегиње Милице, Дурлан, Моше Пијаде, Ниш (Пантелеј), Градска општина Пантелеј, City of Niš, Nisava Administrative District, Central Serbia, 18103, Serbia","class":"highway","type":"residential","importance":0.20000999999999994}] */
/*{"results":[{"search_id":"Route","locations":[{"id":"43.3313486,21.8919514","properties":[{"route":{"departure_time":"2024-07-17T14:46:31+02:00","arrival_time":"2024-07-17T14:58:28+02:00","parts":[{"id":0,"type":"road","mode":"car","directions":"Drive 57 meters along Кнегиње Милице","distance":57,"travel_time":10,"coords":[{"lat":43.33156100000005,"lng":21.931582000000034},{"lat":43.33207490000007,"lng":21.931547000000013}],"road":"Кнегиње Милице"},{"id":1,"type":"road","mode":"car","directions":"Turn left onto Јеремије Живановића and drive 168 meters","distance":168,"travel_time":30,"coords":[{"lat":43.33207490000007,"lng":21.931547000000013},{"lat":43.33205650000007,"lng":21.93085540000001},{"lat":43.33203780000006,"lng":21.930149700000012},{"lat":43.33202900000008,"lng":21.92981830000003},{"lat":43.33201900000005,"lng":21.929440200000034}],"road":"Јеремије Живановића","turn":"left"},{"id":2,"type":"road","mode":"car","directions":"Turn right onto Петра Добрњца and drive 119 meters","distance":119,"travel_time":21,"coords":[{"lat":43.33201900000005,"lng":21.929440200000034},{"lat":43.3325848999999,"lng":21.929421200000043},{"lat":43.33310239999996,"lng":21.929382699999945}],"road":"Петра Добрњца","turn":"right"},{"id":3,"type":"road","mode":"car","directions":"Turn left onto Николаја Велимировића and drive 114 meters","distance":114,"travel_time":21,"coords":[{"lat":43.33310239999996,"lng":21.929382699999945},{"lat":43.33306400000005,"lng":21.927965200000035}],"road":"Николаја Велимировића","turn":"left"},{"id":4,"type":"road","mode":"car","directions":"Turn right onto Грчка and drive 60 meters","distance":60,"travel_time":11,"coords":[{"lat":43.33306400000005,"lng":21.927965200000035},{"lat":43.33361140000007,"lng":21.92793140000001}],"road":"Грчка","turn":"right"},{"id":5,"type":"road","mode":"car","directions":"Turn left onto Кнеза Михајла Обреновића and drive 69 meters","distance":69,"travel_time":13,"coords":[{"lat":43.33361140000007,"lng":21.92793140000001},{"lat":43.33358890000005,"lng":21.927069600000035}],"road":"Кнеза Михајла Обреновића","turn":"left"},{"id":6,"type":"road","mode":"car","directions":"Turn right onto Деспота Ђурђа and drive 222 meters","distance":222,"travel_time":52,"coords":[{"lat":43.33358890000005,"lng":21.927069600000035},{"lat":43.33411910000005,"lng":21.927040600000016},{"lat":43.33471349999999,"lng":21.927007999999976},{"lat":43.335329200000025,"lng":21.926974500000025},{"lat":43.3353828000001,"lng":21.926976799999984},{"lat":43.33550300000009,"lng":21.926983099999998},{"lat":43.33561310000009,"lng":21.926978799999997}],"road":"Деспота Ђурђа","turn":"right"},{"id":7,"type":"road","mode":"car","directions":"Turn left onto Булевар Светог Пантелејмона and drive 370 meters","distance":370,"travel_time":23,"coords":[{"lat":43.33561310000009,"lng":21.926978799999997},{"lat":43.33555860000022,"lng":21.92470940000004},{"lat":43.335536800000135,"lng":21.92361339999996},{"lat":43.335504700000115,"lng":21.922871800000046},{"lat":43.33549589999983,"lng":21.922700100000043},{"lat":43.33549589999983,"lng":21.922600900000045},{"lat":43.33549779999983,"lng":21.922517700000043},{"lat":43.33550079999983,"lng":21.922437200000044},{"lat":43.3355021000001,"lng":21.922370399999924}],"road":"Булевар Светог Пантелејмона","turn":"left"},{"id":8,"type":"road","mode":"car","directions":"Slight right onto Сомборски булевар and drive 25 meters","distance":25,"travel_time":12,"coords":[{"lat":43.3355021000001,"lng":21.922370399999924},{"lat":43.335523199999834,"lng":21.92233000000004},{"lat":43.3355362000001,"lng":21.922283499999924},{"lat":43.33554040000008,"lng":21.922234100000026},{"lat":43.33553339999983,"lng":21.922175100000043},{"lat":43.33551379999983,"lng":21.922121700000044},{"lat":43.335485400000096,"lng":21.922080899999923}],"road":"Сомборски булевар","turn":"slight_right"},{"id":9,"type":"road","mode":"car","directions":"Slight right onto Булевар Светог Пантелејмона and drive 373 meters","distance":373,"travel_time":50,"coords":[{"lat":43.335485400000096,"lng":21.922080899999923},{"lat":43.33543539999983,"lng":21.921966500000046},{"lat":43.33540940000008,"lng":21.921887900000026},{"lat":43.33533769999984,"lng":21.921562800000043},{"lat":43.33527770000003,"lng":21.92132360000004},{"lat":43.33523229999984,"lng":21.921159000000042},{"lat":43.335180999999835,"lng":21.920964800000043},{"lat":43.33507069999987,"lng":21.920581899999874},{"lat":43.33481829999987,"lng":21.919775999999878},{"lat":43.33466840000012,"lng":21.919279699999993},{"lat":43.33441699999985,"lng":21.918338800000033},{"lat":43.33438189999983,"lng":21.91821750000004},{"lat":43.33433019999984,"lng":21.918063900000043},{"lat":43.33427540000023,"lng":21.91791420000004},{"lat":43.334222100000225,"lng":21.917768500000037}],"road":"Булевар Светог Пантелејмона","turn":"slight_right"},{"id":10,"type":"road","mode":"car","directions":"Continue straight for 18 meters","distance":18,"travel_time":6,"coords":[{"lat":43.334222100000225,"lng":21.917768500000037},{"lat":43.33421969999985,"lng":21.91773700000004},{"lat":43.334204799999846,"lng":21.91767560000004},{"lat":43.33418050000009,"lng":21.917620199999995},{"lat":43.334142700000086,"lng":21.917567799999997}],"turn":"straight"},{"id":11,"type":"road","mode":"car","directions":"Slight right onto Булевар Светог Пантелејмона and drive 644 meters","distance":644,"travel_time":84,"coords":[{"lat":43.334142700000086,"lng":21.917567799999997},{"lat":43.33413370000018,"lng":21.917538200000102},{"lat":43.33411249999984,"lng":21.91748630000004},{"lat":43.33406620000008,"lng":21.917346100000028},{"lat":43.33401509999984,"lng":21.91719230000004},{"lat":43.33399729999984,"lng":21.917115300000038},{"lat":43.33398350000008,"lng":21.917043800000027},{"lat":43.333967399999835,"lng":21.91692050000004},{"lat":43.333960999999974,"lng":21.91679440000001},{"lat":43.333970300000075,"lng":21.916604800000027},{"lat":43.33398880000008,"lng":21.916365000000027},{"lat":43.33422790000008,"lng":21.91365980000002},{"lat":43.33430230000008,"lng":21.91260670000002},{"lat":43.3343810000001,"lng":21.91163229999998},{"lat":43.33438980000008,"lng":21.91152280000002},{"lat":43.33450649999988,"lng":21.909924199999995},{"lat":43.33450949999989,"lng":21.909882399999994},{"lat":43.33452700000008,"lng":21.909643000000024}],"road":"Булевар Светог Пантелејмона","turn":"slight_right"},{"id":12,"type":"road","mode":"car","directions":"Slight left onto Косовке девојке and drive 756 meters","distance":756,"travel_time":95,"coords":[{"lat":43.33452700000008,"lng":21.909643000000024},{"lat":43.33443670000009,"lng":21.909535399999996},{"lat":43.334415300000096,"lng":21.90951259999998},{"lat":43.33433379999988,"lng":21.909425499999994},{"lat":43.33423659999989,"lng":21.909331599999994},{"lat":43.334087600000025,"lng":21.90919570000003},{"lat":43.3339314,"lng":21.90906149999998},{"lat":43.33379700000004,"lng":21.90901200000003},{"lat":43.33366160000002,"lng":21.908951500000097},{"lat":43.33305059999989,"lng":21.908678400000014},{"lat":43.332911000000095,"lng":21.908616000000016},{"lat":43.33259969999993,"lng":21.9084749},{"lat":43.332411600000086,"lng":21.908383699999927},{"lat":43.331833900000085,"lng":21.908103599999926},{"lat":43.33168200000003,"lng":21.90803000000003},{"lat":43.331460500000084,"lng":21.907924599999927},{"lat":43.33118600000003,"lng":21.907794000000028},{"lat":43.33062100000003,"lng":21.90752200000003},{"lat":43.330048000000026,"lng":21.90727700000003},{"lat":43.329944700000084,"lng":21.907228599999925},{"lat":43.3297915,"lng":21.90715690000007},{"lat":43.32962139999985,"lng":21.907077199999968},{"lat":43.329368700000025,"lng":21.90695880000003},{"lat":43.329263700000084,"lng":21.906909499999927},{"lat":43.32891919999985,"lng":21.906747899999967},{"lat":43.3288027000003,"lng":21.90669330000001},{"lat":43.32863400000003,"lng":21.90661790000003},{"lat":43.328466499999884,"lng":21.906539700000014},{"lat":43.328396599999884,"lng":21.906507100000013},{"lat":43.328284199999885,"lng":21.906460600000013},{"lat":43.32824739999988,"lng":21.906442300000013},{"lat":43.328212499999886,"lng":21.906421300000016},{"lat":43.3281760999995,"lng":21.90638939999992},{"lat":43.328151599999885,"lng":21.906360800000016},{"lat":43.32811910000003,"lng":21.906312300000028}],"road":"Косовке девојке","turn":"slight_left"},{"id":13,"type":"road","mode":"car","directions":"Slight right onto Пантелејска and drive 218 meters","distance":218,"travel_time":33,"coords":[{"lat":43.32811910000003,"lng":21.906312300000028},{"lat":43.32790479999989,"lng":21.905335699999853},{"lat":43.32787829999989,"lng":21.905207700000016},{"lat":43.32785270000004,"lng":21.905098000000027},{"lat":43.32767149999993,"lng":21.90416990000002},{"lat":43.32765420000002,"lng":21.90408149999997},{"lat":43.32762470000004,"lng":21.903938699999966},{"lat":43.327577700000035,"lng":21.903699299999964}],"road":"Пантелејска","turn":"slight_right"},{"id":14,"type":"road","mode":"car","directions":"Turn right onto Јована Јовановића Змаја and drive 111 meters","distance":111,"travel_time":23,"coords":[{"lat":43.327577700000035,"lng":21.903699299999964},{"lat":43.32771199999989,"lng":21.903629199999965},{"lat":43.32780760000008,"lng":21.90356370000001},{"lat":43.32787180000002,"lng":21.903507799999968},{"lat":43.32790039999999,"lng":21.903419299999975},{"lat":43.32801119999997,"lng":21.903209399999884},{"lat":43.328094600000036,"lng":21.903082699999963},{"lat":43.328204299999996,"lng":21.902937799999975},{"lat":43.32833090000003,"lng":21.902829999999966}],"road":"Јована Јовановића Змаја","turn":"right"},{"id":15,"type":"road","mode":"car","directions":"Turn left onto Скадарска and drive 88 meters","distance":88,"travel_time":16,"coords":[{"lat":43.32833090000003,"lng":21.902829999999966},{"lat":43.32823499999989,"lng":21.902674599999965},{"lat":43.328183599999896,"lng":21.902567899999966},{"lat":43.32812160000002,"lng":21.902491399999967},{"lat":43.328041799999895,"lng":21.902407799999967},{"lat":43.327917000000035,"lng":21.902273199999964},{"lat":43.32772890000013,"lng":21.902112700000046}],"road":"Скадарска","turn":"left"},{"id":16,"type":"road","mode":"car","directions":"Turn right onto Булевар Николе Тесле and drive 693 meters","distance":693,"travel_time":60,"coords":[{"lat":43.32772890000013,"lng":21.902112700000046},{"lat":43.32781880000013,"lng":21.901722300000046},{"lat":43.32813690000013,"lng":21.900300800000046},{"lat":43.328266199999874,"lng":21.899906899999976},{"lat":43.328398500000134,"lng":21.899587400000048},{"lat":43.328606699999874,"lng":21.899209799999976},{"lat":43.328806199999875,"lng":21.898926699999976},{"lat":43.330248600001504,"lng":21.89730150000008},{"lat":43.33073760000007,"lng":21.896774900000004},{"lat":43.330985999999875,"lng":21.896507399999976},{"lat":43.33118900000003,"lng":21.89628879999993},{"lat":43.331414899999764,"lng":21.896041000000007},{"lat":43.33149049999977,"lng":21.895962200000007},{"lat":43.33155489999997,"lng":21.89590340000001},{"lat":43.33159049999976,"lng":21.89588280000001},{"lat":43.33161659999976,"lng":21.89587180000001},{"lat":43.33164459999997,"lng":21.895866200000007},{"lat":43.33170230000014,"lng":21.895865699999945}],"road":"Булевар Николе Тесле","turn":"right"},{"id":17,"type":"road","mode":"car","directions":"Continue straight for 117 meters","distance":117,"travel_time":38,"coords":[{"lat":43.33170230000014,"lng":21.895865699999945},{"lat":43.33174770000014,"lng":21.895888699999944},{"lat":43.33179960000014,"lng":21.895897499999943},{"lat":43.331851600000135,"lng":21.895888899999942},{"lat":43.33190050000014,"lng":21.895863399999943},{"lat":43.33194370000014,"lng":21.895822299999942},{"lat":43.33197830000014,"lng":21.895768299999943},{"lat":43.332002500000144,"lng":21.895704499999944},{"lat":43.33201480000014,"lng":21.895634499999943},{"lat":43.332014600000136,"lng":21.895562599999945},{"lat":43.33200190000014,"lng":21.895492799999943},{"lat":43.331984200000136,"lng":21.895443899999943},{"lat":43.331960300000134,"lng":21.895400199999944},{"lat":43.33193110000013,"lng":21.895363099999944},{"lat":43.331897400000145,"lng":21.895334199999944},{"lat":43.331849800000136,"lng":21.895310199999944},{"lat":43.33182459999978,"lng":21.8953035},{"lat":43.33179930000014,"lng":21.895302199999943},{"lat":43.33178079999978,"lng":21.8953028},{"lat":43.33176169999976,"lng":21.895306800000007},{"lat":43.33171069999976,"lng":21.89526810000001},{"lat":43.33167259999976,"lng":21.89523190000001},{"lat":43.331622899999765,"lng":21.89517160000001},{"lat":43.33155829999976,"lng":21.895071500000007}],"turn":"straight"},{"id":18,"type":"road","mode":"car","directions":"Continue onto Александра Медведева for 115 meters","distance":115,"travel_time":10,"coords":[{"lat":43.33155829999976,"lng":21.895071500000007},{"lat":43.331269999999854,"lng":21.89445149999997},{"lat":43.33099889999979,"lng":21.89386680000003}],"road":"Александра Медведева","turn":"straight"},{"id":19,"type":"road","mode":"car","directions":"Turn right  and drive 250 meters","distance":250,"travel_time":62,"coords":[{"lat":43.33099889999979,"lng":21.89386680000003},{"lat":43.33119039999977,"lng":21.89369809999992},{"lat":43.331528699999765,"lng":21.89340919999992},{"lat":43.331787099999936,"lng":21.89318850000002},{"lat":43.3322986999998,"lng":21.892739400000025},{"lat":43.33194789999994,"lng":21.89184780000001}],"turn":"right"},{"id":20,"type":"start_end","mode":"walk","directions":"Your destination is 67 meters south","distance":67,"travel_time":47,"coords":[{"lat":43.33194789999994,"lng":21.89184780000001},{"lat":43.3313486,"lng":21.8919514}],"direction":"south"}]}}]}],"unreachable":[]}]}*/
