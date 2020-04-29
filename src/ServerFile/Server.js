var express = require('express');
var fcm = require('fcm-notification');
var FCM = new fcm('./bihaber01-761bd.json');

var app = express();

var mysql = require('mysql');
var bodyparser = require('body-parser');

app.use(bodyparser.json({type: 'application/json'}));
app.use(bodyparser.urlencoded({extended: true}));

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', //empty for window
  database: 'bihaber',
});

var server = app.listen(4550, function() {
  server.address().address;
  server.address().port;
  console.log('start');
});
pool.getConnection(function(error) {
  if (error) {
    console.log(error);
  } else {
    console.log('connected');
  }
});

// Notification göndermek için
app.post('/Notification', function(req, res) {
  const gelen_token = req.body.giden_token;
  const gelen_baslik = req.body.giden_baslik;
  const gelen_icerik = req.body.giden_icerik;
  //const gelen_ders_kodu = req.body.giden_ders_kodu;

  var message = {
    data: {
      //This is only optional, you can send any data
      score: '850',
      time: '2:45',
    },
    notification: {
      title: gelen_baslik,
      body: gelen_icerik,
    },
    token: gelen_token,
  };

  FCM.send(message, function(err, response) {
    if (err) {
      console.log('error found', err);
    } else {
      console.log('response here', response);
    }
  });
});

// veritabanı bağlantısı için
app.post('/LoginProcess', function(req, res) {
  if (!req.body.Kullanici_Ad || !req.body.Sifre) {
    res
      .status(400)
      .json({success: false, message: 'Lütfen adınızı,sifrenizi giriniz!'});
  } else {
    const Kullanici_Ad = req.body.Kullanici_Ad;
    const Sifre = req.body.Sifre;

    pool.query(
      'SELECT * from yonetim WHERE Kullanici_Ad IN (?) and Sifre IN (?)',
      [Kullanici_Ad, Sifre],
      function(error, rows, fields) {
        if (error) {
          console.log(error);
        } else {
          console.log(rows); //database den gelen dataları terminalde yazdırır
          res.send(rows);
        }
      },
    );
  }
});

app.post('/TokenKontrol', function(req, res) {
  if (!req.body.giden_token) {
    res.status(400).json({success: false, message: 'token gelmedi!'});
  } else {
    const gelen_token = req.body.giden_token;

    pool.query(
      'SELECT * FROM kullanicilar WHERE kullanicilar.Token_id IN (?)',
      [gelen_token],
      function(error, rows, fields) {
        if (error) {
          console.log(error);
        } else {
          console.log(rows); //database den gelen token terminalde yazdırılır.
          res.send(rows);
        }
      },
    );
  }
});

app.post('/ControlOfLesson', function(req, res) {
  if (!req.body.gonderilen_ders_kodu) {
    res
      .status(400)
      .json({success: false, message: 'Lütfen ders kodunu giriniz.'});
  } else {
    const gelen_ders_kodu = req.body.gonderilen_ders_kodu;

    pool.query(
      'SELECT * from dersler WHERE Ders_kodu IN (?)',
      [gelen_ders_kodu],
      function(error, rows, fields) {
        if (error) {
          console.log(error);
        } else {
          console.log(rows); //database den gelen dataları terminalde yazdırır
          res.send(rows);
        }
      },
    );
  }
});

app.post('/BildirimKaydet', function(req, res) {
  if (
    !req.body.giden_baslik ||
    !req.body.giden_icerik ||
    !req.body.giden_ders_id
  ) {
    res
      .status(400)
      .json({success: false, message: 'Lütfen tüm alanları doldurunuz!'});
  } else {
    const gelen_baslik = req.body.giden_baslik;
    const gelen_icerik = req.body.giden_icerik;
    const gelen_ders_id = req.body.giden_ders_id;

    pool.query(
      'INSERT INTO duyurular (Ders_id, Duyuru_baslik, Duyuru_icerik, Okunma_sayisi) VALUES((?),(?),(?),50)',
      [gelen_ders_id, gelen_baslik, gelen_icerik],
      function(error, rows, fields) {
        if (error) {
          console.log(error);
        } else {
          res.send(rows);
        }
      },
    );
  }
});
app.post('/DersAkademisyenKontrol', function(req, res) {
  pool.query(
    'SELECT * FROM ders_akademisyen as da join dersler as d on da.Ders_id=d.Ders_id where d.Ders_id IN (?)',
    [req.body.ders_id],
    function(error, rows, fields) {
      if (error) {
        console.log(error);
      } else {
        console.log(rows); //database den gelen dataları terminalde yazdırır
        res.send(rows);
      }
    },
  );
});

app.post('/DersAkademisyenIliskilendir', function(req, res) {
  pool.query(
    'insert into ders_akademisyen(Ders_id,Akademisyen_id) VALUES((?),(?))',
    [req.body.ders_id, req.body.akademisyen_id],
    function(error, rows, fields) {
      if (error) {
        console.log(error);
      } else {
        console.log(rows); //database den gelen dataları terminalde yazdırır
        res.send(rows);
      }
    },
  );
});
app.post('/LessonsOfAkademisyen', function(req, res) {
  pool.query(
    'SELECT * FROM dersler as d JOIN ders_akademisyen as da on d.Ders_id=da.Ders_id JOIN yonetim as y on da.Akademisyen_id=y.Yonetim_id WHERE y.Yonetim_id=(?)',
    [req.body.giden_akademisyen_id],
    function(error, rows, fields) {
      if (error) {
        console.log(error);
      } else {
        console.log(rows); //database den gelen dataları terminalde yazdırır
        res.send(rows);
      }
    },
  );
});
app.post('/TokenKaydet', function(req, res) {
  if (!req.body.giden_token) {
    res
      .status(400)
      .json({success: false, message: 'Lütfen tüm alanları doldurunuz!'});
  } else {
    const gelen_token = req.body.giden_token;

    pool.query(
      'INSERT INTO kullanicilar (Token_id) VALUES((?))',
      [gelen_token],
      function(error, rows, fields) {
        if (error) {
          console.log(error);
        } else {
          res.send(rows);
        }
      },
    );
  }
});

app.post('/AkademisyenEkle', function(req, res) {
  if (
    !req.body.gonderilen_kullanici_adi ||
    !req.body.gonderilen_sifre ||
    !req.body.gonderilen_adSoyad
  ) {
    res
      .status(400)
      .json({success: false, message: 'Lütfen tüm alanları doldurunuz!'});
  } else {
    const gelen_kullanidi_adi = req.body.gonderilen_kullanici_adi;
    const gelen_sifre = req.body.gonderilen_sifre;
    const gelen_adSoyad = req.body.gonderilen_adSoyad;

    pool.query(
      'INSERT INTO yonetim (Kullanici_Ad, Sifre, AdSoyad, Yetki) VALUES((?),(?),(?),"1")',
      [gelen_kullanidi_adi, gelen_sifre, gelen_adSoyad],
      function(error, rows, fields) {
        if (error) {
          console.log(error);
        } else {
          res.send(rows);
        }
      },
    );
  }
});

app.post('/DersEkle', function(req, res) {
  if (
    !req.body.gonderilen_ders_kodu ||
    !req.body.gonderilen_ders_adi ||
    !req.body.gonderilen_sinif ||
    !req.body.gonderilen_donem
  ) {
    res
      .status(400)
      .json({success: false, message: 'Lütfen tüm alanları doldurunuz!'});
  } else {
    const gelen_ders_kodu = req.body.gonderilen_ders_kodu;
    const gelen_ders_adi = req.body.gonderilen_ders_adi;
    const gelen_sinif = req.body.gonderilen_sinif;
    const gelen_donem = req.body.gonderilen_donem;

    pool.query(
      'INSERT INTO dersler (Ders_kodu, Ders_adi, Donem, Sinif) VALUES((?),(?),(?),(?))',
      [gelen_ders_kodu, gelen_ders_adi, gelen_donem, gelen_sinif],
      function(error, rows, fields) {
        if (error) {
          console.log(error);
        } else {
          console.log('calisti'); //database den gelen dataları terminalde yazdırır
          res.send(rows);
        }
      },
    );
  }
});

app.post('/DeleteNotification', function(req, res) {
  pool.query(
    'DELETE FROM duyurular WHERE Duyuru_id IN (?)',
    [req.body.silinecek_bildirim_id],
    function(error, rows, fields) {
      if (error) {
        console.log(error);
      } else {
        console.log(rows); //database den gelen dataları terminalde yazdırır
        res.send(rows);
      }
    },
  );
});

app.post('/DeleteTeacher', function(req, res) {
  pool.query(
    'DELETE FROM yonetim WHERE Yonetim_id IN (?)',
    [req.body.silinecek_ogretmen_id],
    function(error, rows, fields) {
      if (error) {
        console.log(error);
      } else {
        console.log(rows); //database den gelen dataları terminalde yazdırır
        res.send(rows);
      }
    },
  );
});

app.post('/DeleteLesson', function(req, res) {
  pool.query(
    'DELETE FROM dersler WHERE ders_id IN (?)',
    [req.body.silinecek_ders_id],
    function(error, rows, fields) {
      if (error) {
        console.log(error);
      } else {
        console.log(rows); //database den gelen dataları terminalde yazdırır
        res.send(rows);
      }
    },
  );
});

app.post('/Ders_Aktif_Mi', function(req, res) {
  pool.query(
    'SELECT * FROM kullanici_dersler as kd JOIN kullanicilar as k ON kd.Kullanici_id = k.Kullanici_id WHERE kd.Ders_id = (?) AND k.Token_id = (?)',
    [req.body.kontrol_ders_id, req.body.kontrol_token_id],
    function(error, rows, fields) {
      if (error) {
        console.log(error);
      } else {
        console.log(rows); //database den gelen dataları terminalde yazdırır
        res.send(rows);
      }
    },
  );
});
app.post('/DeleteAktifDers', function(req, res) {
  pool.query(
    'DELETE FROM kullanici_dersler WHERE kullanici_dersler.Ders_id = (?) AND kullanici_dersler.Kullanici_id IN (SELECT kullanicilar.Kullanici_id from kullanicilar where kullanicilar.Token_id= (?) )',
    [req.body.silinecek_ders_id, req.body.silinecek_kullanici_token],
    function(error, rows, fields) {
      if (error) {
        console.log(error);
      } else {
        console.log(rows); //database den gelen dataları terminalde yazdırır
        res.send(rows);
      }
    },
  );
});
app.post('/InsertAktifDers', function(req, res) {
  pool.query(
    'INSERT INTO kullanici_dersler (Ders_id, Kullanici_id) VALUES ((?), (SELECT Kullanici_id from kullanicilar as k where k.Token_id= (?)))',
    [req.body.eklenecek_ders_id, req.body.eklenecek_kullanici_token],
    function(error, rows, fields) {
      if (error) {
        console.log(error);
      } else {
        console.log(rows); //database den gelen dataları terminalde yazdırır
        res.send(rows);
      }
    },
  );
});

app.get('/GetDersler', function(req, res) {
  pool.query('SELECT * FROM dersler', function(error, rows, fields) {
    if (error) {
      console.log(error);
    } else {
      console.log(rows); //database den gelen dataları terminalde yazdırır
      res.send(rows);
    }
  });
});
app.get('/BildirimDersleri', function(req, res) {
  pool.query(
    'SELECT * FROM dersler as d JOIN ders_akademisyen as da ON d.Ders_id=da.Ders_id',
    function(error, rows, fields) {
      if (error) {
        console.log(error);
      } else {
        console.log(rows); //database den gelen dataları terminalde yazdırır
        res.send(rows);
      }
    },
  );
});
app.post('/duyurularim_goruntule', function(req, res) {
  pool.query(
    // En son yapılan duyuru, en üstte görünmesi için ORDER BY (duyurular.Duyuru_tarih) DESC yapmamız gerekiyor. INFO simgesine tıklandığında diğer tabloları bağlamak için başka request göndererek tabloları bağlayabiliriz.
    // SELECT d.Duyuru_baslik,d.Duyuru_icerik, d.Duyuru_id, dersler.Ders_kodu,dersler.Ders_adi, d.Duyuru_tarih FROM duyurular as d JOIN kullanici_dersler as kd ON d.Ders_id = kd.Ders_id JOIN dersler ON dersler.Ders_id = kd.Ders_id ORDER BY Duyuru_tarih DESC

    'SELECT d.Duyuru_baslik,d.Duyuru_icerik, d.Duyuru_id, dersler.Ders_kodu, dersler.Donem, dersler.Ders_adi, d.Duyuru_tarih FROM duyurular as d JOIN kullanici_dersler as kd ON d.Ders_id = kd.Ders_id JOIN dersler ON dersler.Ders_id = kd.Ders_id WHERE dersler.Donem IN (SELECT aktif_donem.donem_adi FROM aktif_donem) AND kd.Kullanici_id IN (SELECT kullanicilar.Kullanici_id FROM kullanicilar WHERE kullanicilar.Token_id = (?))',
    [req.body.goruntulenecek_kullanici_token],
    function(error, rows, fields) {
      if (error) {
        console.log(error);
      } else {
        console.log(rows); //database den gelen dataları terminalde yazdırır
        res.send(rows);
      }
    },
  );
});
app.post('/derslerim_goruntule', function(req, res) {
  pool.query(
    'SELECT * FROM dersler as d JOIN kullanici_dersler as kd ON d.Ders_id = kd.Ders_id WHERE d.Donem IN (SELECT aktif_donem.donem_adi FROM aktif_donem) AND kd.Kullanici_id In (select Kullanici_id from kullanicilar where kullanicilar.Token_id = (?))',
    [req.body.goruntulenecek_kullanici_token],
    function(error, rows, fields) {
      if (error) {
        console.log(error);
      } else {
        console.log(rows); //database den gelen dataları terminalde yazdırır
        res.send(rows);
      }
    },
  );
});
app.post('/akademisyen_bilgisi', function(req, res) {
  pool.query(
    'SELECT d.Ders_kodu, d.Ders_adi, d.Donem, d.Sinif, y.AdSoyad FROM dersler as d JOIN ders_akademisyen as da ON d.Ders_id = da.Ders_id JOIN yonetim as y ON y.Yonetim_id=da.Akademisyen_id WHERE d.Ders_id = (?)',
    [req.body.gonderilen_ders_id],
    function(error, rows, fields) {
      if (error) {
        console.log(error);
      } else {
        console.log(rows); //database den gelen dataları terminalde yazdırır
        res.send(rows);
      }
    },
  );
});
app.post('/ders_bilgisi', function(req, res) {
  pool.query(
    'SELECT d.Ders_kodu, d.Ders_adi, d.Donem, d.Sinif FROM dersler as d WHERE d.Ders_id = (?)',
    [req.body.gonderilen_ders_id],
    function(error, rows, fields) {
      if (error) {
        console.log(error);
      } else {
        console.log(rows); //database den gelen dataları terminalde yazdırır
        res.send(rows);
      }
    },
  );
});
app.post('/DersiAlanTokenlar', function(req, res) {
  pool.query(
    'select DISTINCT k.Token_id from kullanicilar as k JOIN kullanici_dersler as kd on k.Kullanici_id=kd.Kullanici_id JOIN dersler as d on kd.Ders_id=d.Ders_id WHERE d.Ders_id IN (?)',
    [req.body.gonderilen_ders_id],
    function(error, rows, fields) {
      if (error) {
        console.log(error);
      } else {
        console.log(rows); //database den gelen dataları terminalde yazdırır
        res.send(rows);
      }
    },
  );
});
app.post('/GetAllNotificationsForAkademisyen', function(req, res) {
  pool.query(
    'SELECT * FROM dersler as d JOIN ders_akademisyen as da on d.Ders_id=da.Ders_id JOIN duyurular as du on da.Ders_id=du.Ders_id where da.Akademisyen_id IN (?)',
    [req.body.giden_akademisyen_id],
    function(error, rows, fields) {
      if (error) {
        console.log(error);
      } else {
        console.log(rows); //database den gelen dataları terminalde yazdırır
        res.send(rows);
      }
    },
  );
});

app.post('/AktifDonemDegistir', function(req, res) {
  pool.query(
    'UPDATE aktif_donem SET donem_adi = (?)',
    [req.body.gonderilen_aktif_donem],
    function(error, rows, fields) {
      if (error) {
        console.log(error);
      } else {
        console.log(rows); //database den gelen dataları terminalde yazdırır
        res.send(rows);
      }
    },
  );
});
app.post('/Kullanici_Dersleri_Ve_Tum_Dersler', function(req, res) {
  pool.query(
    'SELECT newTable.Ders_id, newTable.Ders_kodu, newTable.Ders_adi, newTable.Donem, newTable.Kullanici_id, COALESCE(kullanici_dersler.Aktiflik,0) as AktifSonuc from (select * from dersler, kullanicilar where dersler.Donem IN (SELECT aktif_donem.donem_adi FROM aktif_donem)  AND kullanicilar.Token_id=(?)) as newTable left outer join kullanici_dersler on newTable.Ders_id = kullanici_dersler.Ders_id and newTable.Kullanici_id=kullanici_dersler.Kullanici_id',
    [req.body.token],
    function(error, rows, fields) {
      if (error) {
        console.log(error);
      } else {
        console.log(rows); //database den gelen dataları terminalde yazdırır
        res.send(rows);
      }
    },
  );
});
app.post('/Kullanici_Dersleri', function(req, res) {
  pool.query(
    'SELECT * FROM kullanicilar as k join kullanici_dersler as kd on k.Kullanici_id=kd.Kullanici_id join dersler as d on kd.Ders_id=d.Ders_id where k.Token_id IN (?)',
    [req.body.token],
    function(error, rows, fields) {
      if (error) {
        console.log(error);
      } else {
        console.log(rows); //database den gelen dataları terminalde yazdırır
        res.send(rows);
      }
    },
  );
});
app.post('/duyuru_bilgisi', function(req, res) {
  pool.query(
    'SELECT de.Ders_kodu,de.Ders_adi,du.Duyuru_baslik,du.Duyuru_icerik,du.Duyuru_tarih,y.AdSoyad FROM duyurular as du JOIN dersler as de on du.Ders_id=de.Ders_id JOIN ders_akademisyen as da ON de.Ders_id=da.Ders_id join yonetim as y on da.Akademisyen_id=y.Yonetim_id where du.Duyuru_id IN (?)',
    [req.body.gonderilen_duyuru_id],
    function(error, rows, fields) {
      if (error) {
        console.log(error);
      } else {
        console.log(rows); //database den gelen dataları terminalde yazdırır
        res.send(rows);
      }
    },
  );
});
app.get('/GetAllNotifications', function(req, res) {
  pool.query('SELECT * FROM duyurular', function(error, rows, fields) {
    if (error) {
      console.log(error);
    } else {
      console.log(rows); //database den gelen dataları terminalde yazdırır
      res.send(rows);
    }
  });
});
app.get('/akademisyen_getir', function(req, res) {
  pool.query(
    'SELECT AdSoyad, Yonetim_id FROM yonetim where Yetki = 1',
    function(error, rows, fields) {
      if (error) {
        console.log(error);
      } else {
        console.log(rows); //database den gelen dataları terminalde yazdırır
        res.send(rows);
      }
    },
  );
});

app.get('/GetAllTeachers', function(req, res) {
  pool.query('SELECT * FROM yonetim', function(error, rows, fields) {
    if (error) {
      console.log(error);
    } else {
      console.log(rows); //database den gelen dataları terminalde yazdırır
      res.send(rows);
    }
  });
});

app.post('/GuncellenecekDers', function(req, res) {
  if (!req.body.guncellenecek_ders_id) {
    res.status(400).json({success: false, message: 'Ders Kodu Girilmedi'});
  } else {
    const ders_id = req.body.guncellenecek_ders_id;

    pool.query(
      'SELECT * from dersler WHERE Ders_id IN (?)',
      [ders_id],
      function(error, rows, fields) {
        if (error) {
          console.log(error);
        } else {
          console.log(rows); //database den gelen dataları terminalde yazdırır
          res.send(rows);
        }
      },
    );
  }
});

app.post('/UpdateLesson', function(req, res) {
  if (!req.body.guncellenecek_ders_id) {
    res.status(400).json({success: false, message: 'Ders Kodu Girilmedi'});
  } else {
    const ders_id = req.body.guncellenecek_ders_id;
    const ders_kodu = req.body.guncellenecek_ders_kodu;
    const ders_adi = req.body.guncellenecek_ders_adi;
    const donem = req.body.guncellenecek_donem;
    const sinif = req.body.guncellenecek_sinif;

    pool.query(
      'UPDATE dersler SET Ders_kodu = (?), Ders_adi = (?), Donem = (?), Sinif = (?) WHERE Ders_id = (?)',
      [ders_kodu, ders_adi, donem, sinif, ders_id],
      function(error, rows, fields) {
        if (error) {
          console.log(error);
        } else {
          console.log(rows); //database den gelen dataları terminalde yazdırır
          res.send(rows);
        }
      },
    );
  }
});
