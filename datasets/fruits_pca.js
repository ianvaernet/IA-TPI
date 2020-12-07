const fruits_pca = [
  { x1: 0.32775842196320015, x2: -0.367993650767199, Clase: "apple" },
  { x1: 0.18269057709628456, x2: -0.2908348952003847, Clase: "apple" },
  { x1: 0.10525849512597181, x2: -0.33266762169984343, Clase: "apple" },
  { x1: -0.5532612597537014, x2: 0.09468733448624299, Clase: "mandarin" },
  { x1: -0.5929461585363941, x2: 0.058708403973077514, Clase: "mandarin" },
  { x1: -0.6480655895791102, x2: 0.006280689628392775, Clase: "mandarin" },
  { x1: -0.6492569697349969, x2: 0.1083611398942985, Clase: "mandarin" },
  { x1: -0.696954066539548, x2: 0.11079774132674565, Clase: "mandarin" },
  { x1: -0.02964076865140061, x2: 0.37575156642287916, Clase: "apple" },
  { x1: -0.043479681018348156, x2: 0.3578173270032525, Clase: "apple" },
  { x1: -0.12971594466280695, x2: 0.39738248283325056, Clase: "apple" },
  { x1: -0.05757801405549237, x2: 0.3802942802417654, Clase: "apple" },
  { x1: -0.13237663937011676, x2: 0.287608187327589, Clase: "apple" },
  { x1: 0.06067496039118825, x2: -0.13325375985092014, Clase: "apple" },
  { x1: 0.057215472676680486, x2: -0.1248318555924595, Clase: "apple" },
  { x1: 0.065803915772412, x2: -0.10609953650026267, Clase: "apple" },
  { x1: 0.08966850450130266, x2: -0.17789898869710993, Clase: "apple" },
  { x1: 0.08020061126982277, x2: -0.04028284184213292, Clase: "apple" },
  { x1: -0.0142703983298191, x2: 0.21304189673540808, Clase: "apple" },
  { x1: -0.031098430614323463, x2: 0.2483760658308949, Clase: "apple" },
  { x1: -1.9749273622850256e-06, x2: 0.2656226772518631, Clase: "apple" },
  { x1: -0.023441895854333726, x2: 0.21237557598567913, Clase: "apple" },
  { x1: -0.10864713209109028, x2: 0.27778667036934407, Clase: "apple" },
  { x1: 0.05919692214546472, x2: 0.31009328059423236, Clase: "apple" },
  { x1: 0.809438513407125, x2: 0.15926867542146783, Clase: "orange" },
  { x1: 0.8545526450026791, x2: 0.19219059978697525, Clase: "orange" },
  { x1: 0.9352974806491359, x2: 0.20310011208699316, Clase: "orange" },
  { x1: 0.26188357787332556, x2: 0.009958007802382337, Clase: "orange" },
  { x1: -0.14026056592900227, x2: -0.12222342602660904, Clase: "orange" },
  { x1: -0.06646966284508013, x2: 0.1135752186930661, Clase: "orange" },
  { x1: -0.03809609705056934, x2: 0.06846519659073122, Clase: "orange" },
  { x1: 0.20689045280424315, x2: 0.20567315153950833, Clase: "orange" },
  { x1: -0.053181775403634134, x2: 0.1248152200390921, Clase: "orange" },
  { x1: 0.16007961549035088, x2: -0.02345256235549501, Clase: "orange" },
  { x1: 0.04999334333573839, x2: -0.010893796635734532, Clase: "orange" },
  { x1: -0.0059734571894955344, x2: -0.04813534799449316, Clase: "orange" },
  { x1: -0.01325586674420655, x2: -0.00528450445036769, Clase: "orange" },
  { x1: -0.029863317216706587, x2: 0.0896125577833246, Clase: "orange" },
  { x1: 0.010018858200990643, x2: 0.016195891075529763, Clase: "orange" },
  { x1: -0.10548404071552887, x2: -0.05383582572589561, Clase: "orange" },
  { x1: -0.04198509580058611, x2: 0.04224055975236357, Clase: "orange" },
  { x1: 0.14191346901159554, x2: 0.0914607470649165, Clase: "orange" },
  { x1: -0.06664166818176456, x2: 0.15702236233305572, Clase: "orange" },
  { x1: 0.3094728306476531, x2: -0.2313560559125702, Clase: "lemon" },
  { x1: 0.3448324102899096, x2: -0.1810344539543242, Clase: "lemon" },
  { x1: 0.19842836620011306, x2: -0.1428014354575414, Clase: "lemon" },
  { x1: 0.35845749904981417, x2: -0.18147489050800097, Clase: "lemon" },
  { x1: 0.27406270840875574, x2: -0.14978075070887473, Clase: "lemon" },
  { x1: 0.26027242366707704, x2: -0.18110701989548503, Clase: "lemon" },
  { x1: -0.18013588084184062, x2: -0.24042267524426966, Clase: "lemon" },
  { x1: -0.18265665086569643, x2: -0.2524818114286734, Clase: "lemon" },
  { x1: -0.27040111906971875, x2: -0.2083952490287181, Clase: "lemon" },
  { x1: -0.24323058601959463, x2: -0.23590406604472997, Clase: "lemon" },
  { x1: -0.20042340084085264, x2: -0.19666660189032265, Clase: "lemon" },
  { x1: -0.1718409058228373, x2: -0.2666929760340347, Clase: "lemon" },
  { x1: -0.20664951168954124, x2: -0.1939182733735007, Clase: "lemon" },
  { x1: -0.24381364044837786, x2: -0.21783806770226224, Clase: "lemon" },
  { x1: -0.038240864967612975, x2: -0.18894305729038602, Clase: "lemon" },
  { x1: -0.1947230436193457, x2: -0.27205762206171596, Clase: "lemon" }
];
