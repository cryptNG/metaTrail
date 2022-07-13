import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class World extends Component {

    @tracked hasPosition=false;

    @service positioning;
   
    constructor(){
      super(...arguments);
      this.positioning.updatePosition.on(this.update);
    }

    setupWorld=()=>{
      const that = this;
      const width = 1600;
      const height = 800;
      const config = {
        speed: 0.005,
        verticalTilt: -30,
        horizontalTilt: 0
      }
      const svg = d3.select('#world-svg svg')
          .attr('width', width).attr('height', height);
      const markerGroup = svg.append('g');
      const projection = d3.geoOrthographic();
      const initialScale = projection.scale();
      const path = d3.geoPath().projection(projection);
      const center = [width/2, height/2];
      const locations=[{'latitude':42.546245,'longitude':1.601554},
      {'latitude':23.424076,'longitude':53.847818},
      {'latitude':33.93911,'longitude':67.709953},
      {'latitude':17.060816,'longitude':-61.796428},
      {'latitude':18.220554,'longitude':-63.068615},
      {'latitude':41.153332,'longitude':20.168331},
      {'latitude':40.069099,'longitude':45.038189},
      {'latitude':12.226079,'longitude':-69.060087},
      {'latitude':-11.202692,'longitude':17.873887},
      {'latitude':-75.250973,'longitude':-0.071389},
      {'latitude':-38.416097,'longitude':-63.616672},
      {'latitude':-14.270972,'longitude':-170.132217},
      {'latitude':47.516231,'longitude':14.550072},
      {'latitude':-25.274398,'longitude':133.775136},
      {'latitude':12.52111,'longitude':-69.968338},
      {'latitude':40.143105,'longitude':47.576927},
      {'latitude':43.915886,'longitude':17.679076},
      {'latitude':13.193887,'longitude':-59.543198},
      {'latitude':23.684994,'longitude':90.356331},
      {'latitude':50.503887,'longitude':4.469936},
      {'latitude':12.238333,'longitude':-1.561593},
      {'latitude':42.733883,'longitude':25.48583},
      {'latitude':25.930414,'longitude':50.637772},
      {'latitude':-3.373056,'longitude':29.918886},
      {'latitude':9.30769,'longitude':2.315834},
      {'latitude':32.321384,'longitude':-64.75737},
      {'latitude':4.535277,'longitude':114.727669},
      {'latitude':-16.290154,'longitude':-63.588653},
      {'latitude':-14.235004,'longitude':-51.92528},
      {'latitude':25.03428,'longitude':-77.39628},
      {'latitude':27.514162,'longitude':90.433601},
      {'latitude':-54.423199,'longitude':3.413194},
      {'latitude':-22.328474,'longitude':24.684866},
      {'latitude':53.709807,'longitude':27.953389},
      {'latitude':17.189877,'longitude':-88.49765},
      {'latitude':56.130366,'longitude':-106.346771},
      {'latitude':-12.164165,'longitude':96.870956},
      {'latitude':-4.038333,'longitude':21.758664},
      {'latitude':6.611111,'longitude':20.939444},
      {'latitude':-0.228021,'longitude':15.827659},
      {'latitude':46.818188,'longitude':8.227512},
      {'latitude':7.539989,'longitude':-5.54708},
      {'latitude':-21.236736,'longitude':-159.777671},
      {'latitude':-35.675147,'longitude':-71.542969},
      {'latitude':7.369722,'longitude':12.354722},
      {'latitude':35.86166,'longitude':104.195397},
      {'latitude':4.570868,'longitude':-74.297333},
      {'latitude':9.748917,'longitude':-83.753428},
      {'latitude':21.521757,'longitude':-77.781167},
      {'latitude':16.002082,'longitude':-24.013197},
      {'latitude':-10.447525,'longitude':105.690449},
      {'latitude':35.126413,'longitude':33.429859},
      {'latitude':49.817492,'longitude':15.472962},
      {'latitude':51.165691,'longitude':10.451526},
      {'latitude':11.825138,'longitude':42.590275},
      {'latitude':56.26392,'longitude':9.501785},
      {'latitude':15.414999,'longitude':-61.370976},
      {'latitude':18.735693,'longitude':-70.162651},
      {'latitude':28.033886,'longitude':1.659626},
      {'latitude':-1.831239,'longitude':-78.183406},
      {'latitude':58.595272,'longitude':25.013607},
      {'latitude':26.820553,'longitude':30.802498},
      {'latitude':24.215527,'longitude':-12.885834},
      {'latitude':15.179384,'longitude':39.782334},
      {'latitude':40.463667,'longitude':-3.74922},
      {'latitude':9.145,'longitude':40.489673},
      {'latitude':61.92411,'longitude':25.748151},
      {'latitude':-16.578193,'longitude':179.414413},
      {'latitude':-51.796253,'longitude':-59.523613},
      {'latitude':7.425554,'longitude':150.550812},
      {'latitude':61.892635,'longitude':-6.911806},
      {'latitude':46.227638,'longitude':2.213749},
      {'latitude':-0.803689,'longitude':11.609444},
      {'latitude':55.378051,'longitude':-3.435973},
      {'latitude':12.262776,'longitude':-61.604171},
      {'latitude':42.315407,'longitude':43.356892},
      {'latitude':3.933889,'longitude':-53.125782},
      {'latitude':49.465691,'longitude':-2.585278},
      {'latitude':7.946527,'longitude':-1.023194},
      {'latitude':36.137741,'longitude':-5.345374},
      {'latitude':71.706936,'longitude':-42.604303},
      {'latitude':13.443182,'longitude':-15.310139},
      {'latitude':9.945587,'longitude':-9.696645},
      {'latitude':16.995971,'longitude':-62.067641},
      {'latitude':1.650801,'longitude':10.267895},
      {'latitude':39.074208,'longitude':21.824312},
      {'latitude':-54.429579,'longitude':-36.587909},
      {'latitude':15.783471,'longitude':-90.230759},
      {'latitude':13.444304,'longitude':144.793731},
      {'latitude':11.803749,'longitude':-15.180413},
      {'latitude':4.860416,'longitude':-58.93018},
      {'latitude':31.354676,'longitude':34.308825},
      {'latitude':22.396428,'longitude':114.109497},
      {'latitude':-53.08181,'longitude':73.504158},
      {'latitude':15.199999,'longitude':-86.241905},
      {'latitude':45.1,'longitude':15.2},
      {'latitude':18.971187,'longitude':-72.285215},
      {'latitude':47.162494,'longitude':19.503304},
      {'latitude':-0.789275,'longitude':113.921327},
      {'latitude':53.41291,'longitude':-8.24389},
      {'latitude':31.046051,'longitude':34.851612},
      {'latitude':54.236107,'longitude':-4.548056},
      {'latitude':20.593684,'longitude':78.96288},
      {'latitude':-6.343194,'longitude':71.876519},
      {'latitude':33.223191,'longitude':43.679291},
      {'latitude':32.427908,'longitude':53.688046},
      {'latitude':64.963051,'longitude':-19.020835},
      {'latitude':41.87194,'longitude':12.56738},
      {'latitude':49.214439,'longitude':-2.13125},
      {'latitude':18.109581,'longitude':-77.297508},
      {'latitude':30.585164,'longitude':36.238414},
      {'latitude':36.204824,'longitude':138.252924},
      {'latitude':-0.023559,'longitude':37.906193},
      {'latitude':41.20438,'longitude':74.766098},
      {'latitude':12.565679,'longitude':104.990963},
      {'latitude':-3.370417,'longitude':-168.734039},
      {'latitude':-11.875001,'longitude':43.872219},
      {'latitude':17.357822,'longitude':-62.782998},
      {'latitude':40.339852,'longitude':127.510093},
      {'latitude':35.907757,'longitude':127.766922},
      {'latitude':29.31166,'longitude':47.481766},
      {'latitude':19.513469,'longitude':-80.566956},
      {'latitude':48.019573,'longitude':66.923684},
      {'latitude':19.85627,'longitude':102.495496},
      {'latitude':33.854721,'longitude':35.862285},
      {'latitude':13.909444,'longitude':-60.978893},
      {'latitude':47.166,'longitude':9.555373},
      {'latitude':7.873054,'longitude':80.771797},
      {'latitude':6.428055,'longitude':-9.429499},
      {'latitude':-29.609988,'longitude':28.233608},
      {'latitude':55.169438,'longitude':23.881275},
      {'latitude':49.815273,'longitude':6.129583},
      {'latitude':56.879635,'longitude':24.603189},
      {'latitude':26.3351,'longitude':17.228331},
      {'latitude':31.791702,'longitude':-7.09262},
      {'latitude':43.750298,'longitude':7.412841},
      {'latitude':47.411631,'longitude':28.369885},
      {'latitude':42.708678,'longitude':19.37439},
      {'latitude':-18.766947,'longitude':46.869107},
      {'latitude':7.131474,'longitude':171.184478},
      {'latitude':41.608635,'longitude':21.745275},
      {'latitude':17.570692,'longitude':-3.996166},
      {'latitude':21.913965,'longitude':95.956223},
      {'latitude':46.862496,'longitude':103.846656},
      {'latitude':22.198745,'longitude':113.543873},
      {'latitude':17.33083,'longitude':145.38469},
      {'latitude':14.641528,'longitude':-61.024174},
      {'latitude':21.00789,'longitude':-10.940835},
      {'latitude':16.742498,'longitude':-62.187366},
      {'latitude':35.937496,'longitude':14.375416},
      {'latitude':-20.348404,'longitude':57.552152},
      {'latitude':3.202778,'longitude':73.22068},
      {'latitude':-13.254308,'longitude':34.301525},
      {'latitude':23.634501,'longitude':-102.552784},
      {'latitude':4.210484,'longitude':101.975766},
      {'latitude':-18.665695,'longitude':35.529562},
      {'latitude':-22.95764,'longitude':18.49041},
      {'latitude':-20.904305,'longitude':165.618042},
      {'latitude':17.607789,'longitude':8.081666},
      {'latitude':-29.040835,'longitude':167.954712},
      {'latitude':9.081999,'longitude':8.675277},
      {'latitude':12.865416,'longitude':-85.207229},
      {'latitude':52.132633,'longitude':5.291266},
      {'latitude':60.472024,'longitude':8.468946},
      {'latitude':28.394857,'longitude':84.124008},
      {'latitude':-0.522778,'longitude':166.931503},
      {'latitude':-19.054445,'longitude':-169.867233},
      {'latitude':-40.900557,'longitude':174.885971},
      {'latitude':21.512583,'longitude':55.923255},
      {'latitude':8.537981,'longitude':-80.782127},
      {'latitude':-9.189967,'longitude':-75.015152},
      {'latitude':-17.679742,'longitude':-149.406843},
      {'latitude':-6.314993,'longitude':143.95555},
      {'latitude':12.879721,'longitude':121.774017},
      {'latitude':30.375321,'longitude':69.345116},
      {'latitude':51.919438,'longitude':19.145136},
      {'latitude':46.941936,'longitude':-56.27111},
      {'latitude':-24.703615,'longitude':-127.439308},
      {'latitude':18.220833,'longitude':-66.590149},
      {'latitude':31.952162,'longitude':35.233154},
      {'latitude':39.399872,'longitude':-8.224454},
      {'latitude':7.51498,'longitude':134.58252},
      {'latitude':-23.442503,'longitude':-58.443832},
      {'latitude':25.354826,'longitude':51.183884},
      {'latitude':-21.115141,'longitude':55.536384},
      {'latitude':45.943161,'longitude':24.96676},
      {'latitude':44.016521,'longitude':21.005859},
      {'latitude':61.52401,'longitude':105.318756},
      {'latitude':-1.940278,'longitude':29.873888},
      {'latitude':23.885942,'longitude':45.079162},
      {'latitude':-9.64571,'longitude':160.156194},
      {'latitude':-4.679574,'longitude':55.491977},
      {'latitude':12.862807,'longitude':30.217636},
      {'latitude':60.128161,'longitude':18.643501},
      {'latitude':1.352083,'longitude':103.819836},
      {'latitude':-24.143474,'longitude':-10.030696},
      {'latitude':46.151241,'longitude':14.995463},
      {'latitude':77.553604,'longitude':23.670272},
      {'latitude':48.669026,'longitude':19.699024},
      {'latitude':8.460555,'longitude':-11.779889},
      {'latitude':43.94236,'longitude':12.457777},
      {'latitude':14.497401,'longitude':-14.452362},
      {'latitude':5.152149,'longitude':46.199616},
      {'latitude':3.919305,'longitude':-56.027783},
      {'latitude':0.18636,'longitude':6.613081},
      {'latitude':13.794185,'longitude':-88.89653},
      {'latitude':34.802075,'longitude':38.996815},
      {'latitude':-26.522503,'longitude':31.465866},
      {'latitude':21.694025,'longitude':-71.797928},
      {'latitude':15.454166,'longitude':18.732207},
      {'latitude':-49.280366,'longitude':69.348557},
      {'latitude':8.619543,'longitude':0.824782},
      {'latitude':15.870032,'longitude':100.992541},
      {'latitude':38.861034,'longitude':71.276093},
      {'latitude':-8.967363,'longitude':-171.855881},
      {'latitude':-8.874217,'longitude':125.727539},
      {'latitude':38.969719,'longitude':59.556278},
      {'latitude':33.886917,'longitude':9.537499},
      {'latitude':-21.178986,'longitude':-175.198242},
      {'latitude':38.963745,'longitude':35.243322},
      {'latitude':10.691803,'longitude':-61.222503},
      {'latitude':-7.109535,'longitude':177.64933},
      {'latitude':23.69781,'longitude':120.960515},
      {'latitude':-6.369028,'longitude':34.888822},
      {'latitude':48.379433,'longitude':31.16558},
      {'latitude':1.373333,'longitude':32.290275},
      {'latitude':37.09024,'longitude':-95.712891},
      {'latitude':-32.522779,'longitude':-55.765835},
      {'latitude':41.377491,'longitude':64.585262},
      {'latitude':41.902916,'longitude':12.453389},
      {'latitude':12.984305,'longitude':-61.287228},
      {'latitude':6.42375,'longitude':-66.58973},
      {'latitude':18.420695,'longitude':-64.639968},
      {'latitude':18.335765,'longitude':-64.896335},
      {'latitude':14.058324,'longitude':108.277199},
      {'latitude':-15.376706,'longitude':166.959158},
      {'latitude':-13.768752,'longitude':-177.156097},
      {'latitude':-13.759029,'longitude':-172.104629},
      {'latitude':42.602636,'longitude':20.902977},
      {'latitude':15.552727,'longitude':48.516388},
      {'latitude':-12.8275,'longitude':45.166244},
      {'latitude':-30.559482,'longitude':22.937506},
      {'latitude':-13.133897,'longitude':27.849332},
      {'latitude':-19.015438,'longitude':29.154857}];
      let currentLocations=[];
      drawGlobe();    
      drawGraticule();
      enableRotation();    

      function drawGlobe() {  
        const rIndex  = Math.floor(Math.random() * locations.length-1);
        currentLocations=[ locations[rIndex]];
        
        d3.queue()
              .defer(d3.json, 'https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/world-110m.json')          
              .await((error, worldData) => {
                  svg.selectAll(".segment")
                      .data(topojson.feature(worldData, worldData.objects.countries).features)
                      .enter().append("path")
                      .attr("class", "segment")
                      .attr("d", path)
                      .style("stroke", "#888")
                      .style("stroke-width", "1px")
                      .style("fill", (d, i) => '#e5e5e5')
                      .style("opacity", ".6");
                      drawMarkers(currentLocations);           
              });

      }

      function drawGraticule() {
          const graticule = d3.geoGraticule()
              .step([10, 10]);

          svg.append("path")
              .datum(graticule)
              .attr("class", "graticule")
              .attr("d", path)
              .style("fill", "#ffffff00")
              .style("opacity", "0.2")
              .style("stroke", "#ccc");
      }

      function enableRotation() {
        
         d3.timer(function (elapsed) {
              projection.rotate([config.speed * elapsed - 120, config.verticalTilt, config.horizontalTilt]);
              svg.selectAll("path").attr("d", path);
              drawMarkers(currentLocations);
          })

          const t = d3.interval(function (elapsed) {
            projection.rotate([config.speed * elapsed - 120, config.verticalTilt, config.horizontalTilt]);
            svg.selectAll("path").attr("d", path);
            const rIndex  = Math.floor(Math.random() * locations.length-1);
         
            if (!that.hasPosition){
              currentLocations=[ locations[rIndex]];
            }else{
              currentLocations=[{'latitude': that.positioning.centeredLatitude, 'longitude': that.positioning.centeredLongitude}];
              t.stop();
            } 
        },200)
          
      }        


      function drawMarkers(locs) {
          
          console.log(`rand loc ${locs}`);
          const markers = markerGroup.selectAll('g')
     
              .data(locs);

              //exit, remove
              markers.exit().remove();
            //enter
            var enter = markers.enter()
                                .append("g");
            //append - as many items as you need
            enter.append("circle");
            enter.append("circle");
            //merge
            var my_group = markers.merge(enter);

            my_group.select("circle")
            .attr('cx', d => projection([d.longitude, d.latitude])[0])
            .attr('cy', d => projection([d.longitude, d.latitude])[1])
            .attr('fill', d => {
                const coordinate = [d.longitude, d.latitude];
                const gdistance = d3.geoDistance(coordinate, projection.invert(center));
                return gdistance > 2.2 ? 'none' : 'steelblue';
            })
            .attr('r', 7);
            
            markerGroup.each(function () {
              setTimeout(() => this.parentNode.appendChild(this),4000);
              

            });
      }
    }

    update=()=>{
      this.hasPosition = true;
      this.positioning.updatePosition.off(this.update);
    }
}
