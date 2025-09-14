'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"flutter_bootstrap.js": "ebeb4c33e864d40bcdf74dd8101eb852",
"version.json": "53a709f895cf94ff80a536526b4679d3",
"index.html": "990e93524500eec7be0d984dcf7e749a",
"/": "990e93524500eec7be0d984dcf7e749a",
"pages-config.json": "75b7dd2ed86e1b4c3e3a7d16313e95eb",
"main.dart.js": "947c4ba5bced9910a5108330a5426ecd",
"flutter.js": "888483df48293866f9f41d3d9274a779",
"index_minimal.html": "d6a4ffc7f6e40aaca1ac6e45fd6e6344",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "d07c03bd0d0b1b9504a97f1bcdded4ed",
".git/config": "8316a3db66d8c4afbdfd4b63a9303bf0",
".git/objects/0d/9bac912468796ff282f8b31ad9f13ee05689fa": "f65ae2b6b74d8958890e88455826f523",
".git/objects/95/b61801d1ddd3b5cd58866f637eae0b251e2f12": "d84bf91fbed1461410973758c3e08673",
".git/objects/0c/83c63aa61f3f6630c858e89e918d2840d95a27": "5a674a9d793407a9bce357a797e60fb3",
".git/objects/66/8c0ab747ca9b650f7cf18ce9e34df3bfba7df3": "528ee56643b65d7e3d04d12b2f04dfa2",
".git/objects/03/eaddffb9c0e55fb7b5f9b378d9134d8d75dd37": "87850ce0a3dd72f458581004b58ac0d6",
".git/objects/9b/3ef5f169177a64f91eafe11e52b58c60db3df2": "91d370e4f73d42e0a622f3e44af9e7b1",
".git/objects/9e/3b4630b3b8461ff43c272714e00bb47942263e": "accf36d08c0545fa02199021e5902d52",
".git/objects/04/631a1f35bc2ed08e83b6d2c7aaaf9136823308": "2391c685be9677fe69d66205bd7da597",
".git/objects/04/775e4c113131f9fc44d77d5aae9ab4f5a16d91": "28060c0b12b15de03495171a97c9e6b2",
".git/objects/69/dd618354fa4dade8a26e0fd18f5e87dd079236": "8cc17911af57a5f6dc0b9ee255bb1a93",
".git/objects/0b/20c2879f716c99c4ae0ecdd3e21dc750fc0919": "27ad04d412c4bc2946b595723b3451fb",
".git/objects/93/1da93dcda297b095d1cdf8158219c5b2ef70da": "4da16395d90c2eda1cdb4109e0a34c86",
".git/objects/60/b94029ff0451d023f66a95c3edb51d22c15aff": "655ed2d9c90371fb8730aa83ab75ec8f",
".git/objects/a3/aecfe19590a740426b13e282577a37ab131330": "66c8af70b4c55bcfc5e2ffc52291b410",
".git/objects/b2/101aa2a41faac01da77ac48be0191206dd695d": "374d6379e8d9938040f4af965aff5457",
".git/objects/ac/b1ab9aafbfa5217f2b4b3918584eebd557e479": "156fc5ede4c1c9efe1f2ec42a4c7c3c4",
".git/objects/d7/7cfefdbe249b8bf90ce8244ed8fc1732fe8f73": "9c0876641083076714600718b0dab097",
".git/objects/d0/90e3de4a1419395994693c996c13b41fc7debd": "88d4ed3f042628cee0b1186538224c21",
".git/objects/da/0d5aa44a8c93eda469f7a99ed8feac32d5b19d": "25d25e93b491abda0b2b909e7485f4d1",
".git/objects/d6/9c56691fbdb0b7efa65097c7cc1edac12a6d3e": "868ce37a3a78b0606713733248a2f579",
".git/objects/d8/8128adaad90d2fd7cdabe7b36eaaaed0d3a25b": "3d15963af0d77c1cd40702fb7c18fa93",
".git/objects/f3/9518d213cacf93d0b67fb05d5e7e26ba63c508": "9136c1ecb018e6b1e4bbae3b06d89540",
".git/objects/eb/9b4d76e525556d5d89141648c724331630325d": "37c0954235cbe27c4d93e74fe9a578ef",
".git/objects/c9/91c6f36c3f6948067697f935d311ada3a89bf5": "08f15fba959eb589d61a5188aee7373d",
".git/objects/f2/04823a42f2d890f945f70d88b8e2d921c6ae26": "6b47f314ffc35cf6a1ced3208ecc857d",
".git/objects/f5/72b90ef57ee79b82dd846c6871359a7cb10404": "e68f5265f0bb82d792ff536dcb99d803",
".git/objects/ca/3bba02c77c467ef18cffe2d4c857e003ad6d5d": "316e3d817e75cf7b1fd9b0226c088a43",
".git/objects/e4/fcf70a431db4f38e5ddc6a6b6307d82ad58270": "e9ec719ae7baf57d6d26874d4f819437",
".git/objects/fe/3b987e61ed346808d9aa023ce3073530ad7426": "dc7db10bf25046b27091222383ede515",
".git/objects/ed/b55d4deb8363b6afa65df71d1f9fd8c7787f22": "886ebb77561ff26a755e09883903891d",
".git/objects/20/3a3ff5cc524ede7e585dff54454bd63a1b0f36": "4b23a88a964550066839c18c1b5c461e",
".git/objects/29/66d07d23ef5914cdd6ec2aedda4e00f1ac7447": "f0d63cc25a6040322a867a0ceefe22c5",
".git/objects/29/f22f56f0c9903bf90b2a78ef505b36d89a9725": "e85914d97d264694217ae7558d414e81",
".git/objects/45/95e1b5b406d92b0410d56e711bcdbb69d98f36": "7e7911bc05b7851fade08b4ef853903a",
".git/objects/8f/e7af5a3e840b75b70e59c3ffda1b58e84a5a1c": "e3695ae5742d7e56a9c696f82745288d",
".git/objects/8a/e4e5024675ae5ea6889870c882645af188b9f3": "feea85f7aaff18e802fe859b59ebe70b",
".git/objects/8a/aa46ac1ae21512746f852a42ba87e4165dfdd1": "1d8820d345e38b30de033aa4b5a23e7b",
".git/objects/10/78e394767867fa72ba30079ffebedd3a0b785f": "aaab8e23dfe056c0093deb436a372763",
".git/objects/26/71a1eaef06077d48f8f6f3e3177207e4978c79": "5470df05f57bc0323384cd4c4d1d5598",
".git/objects/21/791e6e72fba0dfbba5d738497f9498dac61cde": "54eb75bbccb7c9331f0ed7d61ce25587",
".git/objects/4d/bf9da7bcce5387354fe394985b98ebae39df43": "534c022f4a0845274cbd61ff6c9c9c33",
".git/objects/88/cfd48dff1169879ba46840804b412fe02fefd6": "e42aaae6a4cbfbc9f6326f1fa9e3380c",
".git/objects/6b/9862a1351012dc0f337c9ee5067ed3dbfbb439": "85896cd5fba127825eb58df13dfac82b",
".git/objects/09/231efb01701544c7712c0d38c2f7ce530ae293": "5fef6aaa6ba9b796993b6085456e02cd",
".git/objects/98/0d49437042d93ffa850a60d02cef584a35a85c": "8e18e4c1b6c83800103ff097cc222444",
".git/objects/53/c2ca4f9b9a9a5f6fa4262eb857cc02362d1047": "dbe520475b91ddf07565a9abeebdf297",
".git/objects/3f/05b70c9886706367c215d7ff1cef76e78dd25b": "eca0b16d761ebf771c1445c4e932a5a5",
".git/objects/5e/ac0210ce3e328cbe75e6ceee3ca0d13e349ec5": "af80547e62a52f04369b74a5655b9f8b",
".git/objects/d4/3532a2348cc9c26053ddb5802f0e5d4b8abc05": "3dad9b209346b1723bb2cc68e7e42a44",
".git/objects/dd/4e51cdaf41b8b7db8af08f449e48c2313a3ffa": "d34ddaf0204120de00589c5c006d5183",
".git/objects/b6/b8806f5f9d33389d53c2868e6ea1aca7445229": "b14016efdbcda10804235f3a45562bbf",
".git/objects/aa/60faf24372fbf359d142f1acd708e0bfcef1f2": "45607c758dd776fe953290da2ec6fb43",
".git/objects/b7/49bfef07473333cf1dd31e9eed89862a5d52aa": "36b4020dca303986cad10924774fb5dc",
".git/objects/b9/2a0d854da9a8f73216c4a0ef07a0f0a44e4373": "f62d1eb7f51165e2a6d2ef1921f976f3",
".git/objects/c4/016f7d68c0d70816a0c784867168ffa8f419e1": "fdf8b8a8484741e7a3a558ed9d22f21d",
".git/objects/ea/164de1f1dee1a1760a3815df6469e6bd3106db": "e6216fba927b674ed779b80cc9fd1503",
".git/objects/e6/50c18cc8822906833cdf7a9cb8572657ca4bb8": "6a5766ea302e60356015552659aedb8b",
".git/objects/e6/9de29bb2d1d6434b8b29ae775ad8c2e48c5391": "c70c34cbeefd40e7c0149b7a0c2c64c2",
".git/objects/f9/dd3b79b09076cd64e446c75aefa3094068bd54": "919d6c8d19d2b30dd4dfd0a65e903eab",
".git/objects/f0/529aed67c941008a3aac84bb36ae6cb44b8909": "8ee8ad54e09887e85e46e55426aa35b2",
".git/objects/fa/901b6d66f8549460f9cc733d8767ed4f82aa4e": "8ccace52b9a0880de151d808cfe40262",
".git/objects/c5/5ec0c76012c670d5ed691b3657f5e37a06f071": "96bd8d07ef2a275fed004f4ceaf94b5e",
".git/objects/c2/eaef49f54fce8d62a5510b802323f2f877e282": "a34a0b385f4ba5d19de51ac5a4106f2e",
".git/objects/e9/94225c71c957162e2dcc06abe8295e482f93a2": "2eed33506ed70a5848a0b06f5b754f2c",
".git/objects/e0/f7014a420146e483c32f5c15770353f9ec1d5c": "6dc2b7f7a4363ea6a5392d9f2426df21",
".git/objects/46/4ab5882a2234c39b1a4dbad5feba0954478155": "2e52a767dc04391de7b4d0beb32e7fc4",
".git/objects/83/2bfec7496b8df4a38aa5ae4b5128061968e22c": "57891fec1afb19e993af2b7ea0e6c3b9",
".git/objects/1e/7a2d6832062ab785b405cacb59057ea7486647": "d9a0dbb418492428164091311d984056",
".git/objects/84/d25afec62246cc27edbdb21587d2a563942c99": "3840971706caba96b69ea9cdf2ba84ab",
".git/objects/24/337c562da96f0c7142addd7844d14118ec5b51": "6ef415f902098d4cc0767ac30154fedf",
".git/objects/4f/fbe6ec4693664cb4ff395edf3d949bd4607391": "2beb9ca6c799e0ff64e0ad79f9e55e69",
".git/objects/1d/11e2a3129a02b16af2209f6609d04a6e7ecc99": "25303a3c05b920191aedfecec50fd0f9",
".git/objects/1d/959fe3f6d53ae1c94789f0d252dd339cfcb644": "6f76f8ee3c1b806e7fd3165b4026b07d",
".git/objects/1d/f3a033d47935e696064a867debc58a69f98b8d": "92ddfb38e176b189fe19c5fa01165626",
".git/objects/78/e7d74566701b343bc0235edd3feac904f214ad": "0297656f6ad28d77367688b6f3b58b4c",
".git/objects/8b/993125f3803a2f45b163c6478487890718220d": "ca08773c7ba7f1bb5ec1d71af3a48478",
".git/objects/7a/6c1911dddaea52e2dbffc15e45e428ec9a9915": "f1dee6885dc6f71f357a8e825bda0286",
".git/objects/7a/6bfdaf0fefe39cd23ca34679d409e75951f93b": "77e4cf8d6c1c1d8d684847a06f9a3189",
".git/HEAD": "cf7dd3ce51958c5f13fece957cc417fb",
".git/info/exclude": "036208b4a1ab4a235d75c181e685e5a3",
".git/logs/HEAD": "fde1b8684b001fdedb61c9b307b6dd02",
".git/logs/refs/heads/main": "fde1b8684b001fdedb61c9b307b6dd02",
".git/logs/refs/remotes/origin/main": "c091613f44eb35cb83417f3860b8e1f9",
".git/description": "a0a7c3fff21f2aea3cfa1d0316dd816c",
".git/hooks/commit-msg.sample": "579a3c1e12a1e74a98169175fb913012",
".git/hooks/pre-rebase.sample": "56e45f2bcbc8226d2b4200f7c46371bf",
".git/hooks/pre-commit.sample": "305eadbbcd6f6d2567e033ad12aabbc4",
".git/hooks/applypatch-msg.sample": "ce562e08d8098926a3862fc6e7905199",
".git/hooks/fsmonitor-watchman.sample": "a0b2633a2c8e97501610bd3f73da66fc",
".git/hooks/pre-receive.sample": "2ad18ec82c20af7b5926ed9cea6aeedd",
".git/hooks/prepare-commit-msg.sample": "2b5c047bdb474555e1787db32b2d2fc5",
".git/hooks/post-update.sample": "2b7ea5cee3c49ff53d41e00785eb974c",
".git/hooks/pre-merge-commit.sample": "39cb268e2a85d436b9eb6f47614c3cbc",
".git/hooks/pre-applypatch.sample": "054f9ffb8bfe04a599751cc757226dda",
".git/hooks/pre-push.sample": "2c642152299a94e05ea26eae11993b13",
".git/hooks/update.sample": "647ae13c682f7827c22f5fc08a03674e",
".git/hooks/push-to-checkout.sample": "c7ab00c7784efeadad3ae9b228d4b4db",
".git/refs/heads/main": "23c7a274a22f3ef34c5003d6d73944f0",
".git/refs/remotes/origin/main": "23c7a274a22f3ef34c5003d6d73944f0",
".git/index": "e7ba1a3c290f0f0d35ff2ce311ffe2f0",
".git/COMMIT_EDITMSG": "9500619ffe2879c7daf9abb21516966e",
"assets/AssetManifest.json": "2efbb41d7877d10aac9d091f58ccd7b9",
"assets/NOTICES": "25e7970bc6b21faafd4590c406e8e4bf",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/AssetManifest.bin.json": "69a99f98c8b1fb8111c5fb961769fcd8",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "33b7d9392238c04c131b6ce224e13711",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/AssetManifest.bin": "693635b5258fe5f1cda720cf224f158c",
"assets/fonts/MaterialIcons-Regular.otf": "95b7650cdb861034b2ffd2b0981e86f4",
"build-info.txt": "c9953cb26b2562442341beb25da19a14",
"sw.js": "ebb5c70400f83824b4c642ad819d1e6c",
"canvaskit/skwasm.js": "1ef3ea3a0fec4569e5d531da25f34095",
"canvaskit/skwasm_heavy.js": "413f5b2b2d9345f37de148e2544f584f",
"canvaskit/skwasm.js.symbols": "0088242d10d7e7d6d2649d1fe1bda7c1",
"canvaskit/canvaskit.js.symbols": "58832fbed59e00d2190aa295c4d70360",
"canvaskit/skwasm_heavy.js.symbols": "3c01ec03b5de6d62c34e17014d1decd3",
"canvaskit/skwasm.wasm": "264db41426307cfc7fa44b95a7772109",
"canvaskit/chromium/canvaskit.js.symbols": "193deaca1a1424049326d4a91ad1d88d",
"canvaskit/chromium/canvaskit.js": "5e27aae346eee469027c80af0751d53d",
"canvaskit/chromium/canvaskit.wasm": "24c77e750a7fa6d474198905249ff506",
"canvaskit/canvaskit.js": "140ccb7d34d0a55065fbd422b843add6",
"canvaskit/canvaskit.wasm": "07b9f5853202304d3b0749d9306573cc",
"canvaskit/skwasm_heavy.wasm": "8034ad26ba2485dab2fd49bdd786837b"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
