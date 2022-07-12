const express = require("express");
var bodyParser = require("body-parser");
const path = require("path");
const AdminJS = require("adminjs");
const AdminJSExpress = require("@adminjs/express");
const AdminJSMongoose = require("@adminjs/mongoose");
const uploadFeature = require("@adminjs/upload");
const bcrypt = require('bcrypt');
require("./config/db");
require("dotenv").config();

const Destaques = require("./models/Destaques.js");
const Posts = require("./models/Posts.js");
const Estudos = require("./models/Estudos.js");
const Noticias = require("./models/Noticias.js");
const Horarios = require("./models/Horarios.js");
const Users = require("./models/Users.js");
const CategoriaNoticias = require("./models/CategoriasNoticias");

const app = express();

AdminJS.registerAdapter(AdminJSMongoose);

const adminJSOptions = new AdminJS({
  resources: [
    {
      resource: Destaques,
      options: { properties: { conteudo: { type: "richtext" }, image: { isVisible: { edit: false, list: false, show: false, filter: false } } } },
      features: [
        uploadFeature({
          provider: {
            local: {
              bucket: path.join(__dirname, "./public/images"),
            },
          },
          properties: {
            key: "image",
            file: "upload file",
          },
          uploadPath: (record, filename) =>
            Date.now() + ".jpg",
        }),
      ],
    },
    {
      resource: Users,
      options: {
        properties: {
          password: { type: "password", isVisible: { edit: true, list: false, show: false, filter: false } },
          role: {
            availableValues: [
              { value: "admin", label: 'Administrador' },
              { value: "user", label: 'Usuario Padrão' }
            ],
          },
        }
      },
    },
    {
      resource: Posts,
      options: {
        properties: {
          conteudo: { type: "richtext" },
          titulo: { type: "richtext" },
          conteudoCurto: { type: "richtext" },
          categoria: { type: "richtext" },
          image: { isVisible: { edit: false, list: false, show: false, filter: false } }
        },
      },
      features: [
        uploadFeature({
          provider: {
            local: {
              bucket: path.join(__dirname, "./public/images"),
            },
          },
          properties: {
            key: "image",
            file: "upload file",
          },
          uploadPath: (record, filename) =>
            Date.now() + ".jpg",
        }),
      ],
    },
    {
      resource: Estudos,
      options: {
        properties: {
          conteudo: { type: "richtext" },
          titulo: { type: "richtext" },
          conteudoCurto: { type: "richtext" },
          categoria: { type: "richtext" },
          image: { isVisible: { edit: false, list: false, show: false, filter: false } }
        },
      },
      features: [
        uploadFeature({
          provider: {
            local: {
              bucket: path.join(__dirname, "./public/images"),
            },
          },
          properties: {
            key: "image",
            file: "upload file",
          },
          uploadPath: (record, filename) =>
            Date.now() + ".jpg",
        }),
      ],
    },
    {
      resource: Noticias,
      options: {
        properties: {
          conteudo: { type: "richtext" },
          titulo: { type: "richtext" },
          conteudoCurto: { type: "richtext" },
          categoria: { type: "richtext" },
          image: { isVisible: { edit: false, list: false, show: false, filter: false } },
        },
      },
      features: [
        uploadFeature({
          provider: {
            local: {
              bucket: path.join(__dirname, "./public/images"),
            },
          },
          properties: {
            key: "image",
            file: "upload file",
          },
          uploadPath: (record, filename) =>
            Date.now() + ".jpg",
        }),
      ],
    },
    { resource: Horarios },
  ],
  rootPath: "/admin",
  branding: {
    companyName: "Ahavat Chessed",
    logo: "",
    theme: {
      colors: {
        primary100: "#ff0043",
        primary80: "#ff1a57",
        primary60: "#ff3369",
        primary40: "#ff4d7c",
        primary20: "#ff668f",
        grey100: "#151515",
        grey80: "#333333",
        grey60: "#4d4d4d",
        grey40: "#666666",
        grey20: "#dddddd",
        filterBg: "#333333",
        accent: "#151515",
        hoverBg: "#151515",
      },
    },
  },
});

const router = AdminJSExpress.buildAuthenticatedRouter(adminJSOptions, {
  authenticate: async (email, password) => {
    const user = await Users.findOne({ email: email },)

    if (user && user.role === 'admin') {
      const matched = await bcrypt.compare(password, user.password)

      if (matched) {
        return user
      }
    }

    return false

  },
  cookiePassword: process.env.cookiePassword
}, null, {
  resave: false,
  saveUninitialized: false
})

app.use(adminJSOptions.options.rootPath, router);
app.use(bodyParser.json({ type: "application/*+json" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.use("/public", express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "/pages"));

app.get("/", (req, res) => {
  if (req.query.busca == null) {
    Posts.find({})
      .sort({ _id: -1 })
      .limit(6)
      .exec(function (err, posts) {
        posts = posts.map(function (val) {
          return {
            titulo: val.titulo,
            image: val.image,
            conteudo: val.conteudo,
            conteudoCurto: val.conteudoCurto,
            slug: val.slug,
            categoria: val.categoria,
          };
        });

        Destaques.find({})
          .sort({ _id: -1 })
          .exec(function (err, destaques) {
            destaques = destaques.map(function (val) {
              return {
                titulo: val.titulo,
                image: val.image,
                conteudo: val.conteudo,
                conteudoCurto: val.conteudoCurto,
                slug: val.slug,
                categoria: val.categoria,
              };
            });

            Posts.find({})
              .sort({ _id: -1 })
              .limit(3)
              .exec(function (err, ultimas) {
                ultimas = ultimas.map(function (val) {
                  return {
                    titulo: val.titulo,
                    image: val.image,
                    conteudo: val.conteudo,
                    conteudoCurto: val.conteudoCurto,
                    slug: val.slug,
                    categoria: val.categoria,
                  };
                });

                Noticias.find({})
                  .sort({ _id: -1 })
                  .limit(6)
                  .exec(function (err, noticias) {
                    noticias = noticias.map(function (val) {
                      return {
                        titulo: val.titulo,
                        image: val.image,
                        conteudo: val.conteudo,
                        conteudoCurto: val.conteudoCurto,
                        slug: val.slug,
                        categoria: val.categoria,
                      };
                    });

                    Horarios.find({})
                      .sort({ _id: 1 })
                      .exec(function (err, horarios) {
                        horarios = horarios.map(function (val) {
                          return {
                            titulo: val.titulo,
                            horario: val.horario,
                          };
                        });

                        res.render("home", {
                          posts: posts,
                          destaques: destaques,
                          ultimas: ultimas,
                          noticias: noticias,
                          horarios: horarios,
                        });
                      });
                  });
              });
          });
      });

  } else {
    Posts.find(
      { titulo: { $regex: req.query.busca, $options: "i" } },
      function (err, posts) {
        posts = posts.map(function (val) {
          return {
            titulo: val.titulo,
            conteudo: val.conteudo,
            descricaoCurta: val.conteudoCurto,
            image: val.image,
            slug: val.slug,
            categoria: val.categoria,
          };
        });

        Noticias.find(
          { titulo: { $regex: req.query.busca, $options: "i" } },
          function (err, noticias) {
            noticias = noticias.map(function (val) {
              return {
                titulo: val.titulo,
                conteudo: val.conteudo,
                descricaoCurta: val.conteudoCurto,
                image: val.image,
                slug: val.slug,
                categoria: val.categoria,
              };
            });

            res.render("busca", { posts: posts, contagem: posts.length, noticias: noticias, contagem2: noticias.length });
          }
        );
      }
    )
  };
});

app.get("/postagens", (req, res) => {
  if (req.query.busca == null) {
    Posts.find({})
      .sort({ _id: -1 })
      .exec(function (err, posts) {
        posts = posts.map(function (val) {
          return {
            titulo: val.titulo,
            image: val.image,
            conteudo: val.conteudo,
            conteudoCurto: val.conteudoCurto,
            slug: val.slug,
            categoria: val.categoria,
          };
        });
        res.render("postagens", { posts: posts });
      });
  } else {
    Posts.find(
      { titulo: { $regex: req.query.busca, $options: "i" } },
      function (err, posts) {
        posts = posts.map(function (val) {
          return {
            titulo: val.titulo,
            conteudo: val.conteudo,
            descricaoCurta: val.conteudoCurto,
            image: val.image,
            slug: val.slug,
            categoria: val.categoria,
          };
        });

        Noticias.find(
          { titulo: { $regex: req.query.busca, $options: "i" } },
          function (err, noticias) {
            noticias = noticias.map(function (val) {
              return {
                titulo: val.titulo,
                conteudo: val.conteudo,
                descricaoCurta: val.conteudoCurto,
                image: val.image,
                slug: val.slug,
                categoria: val.categoria,
              };
            });

            res.render("busca", { posts: posts, contagem: posts.length, noticias: noticias, contagem2: noticias.length });
          }
        );
      }
    )
  }
});

app.get("/noticias", (req, res) => {
  if (req.query.busca == null) {
    Noticias.find({})
      .sort({ _id: -1 })
      .exec(function (err, noticias) {
        noticias = noticias.map(function (val) {
          return {
            titulo: val.titulo,
            image: val.image,
            conteudo: val.conteudo,
            conteudoCurto: val.conteudoCurto,
            slug: val.slug,
            categoria: val.categoria,
          };
        });
        res.render("noticias", { noticias: noticias });
      });
  } else {
    Posts.find(
      { titulo: { $regex: req.query.busca, $options: "i" } },
      function (err, posts) {
        posts = posts.map(function (val) {
          return {
            titulo: val.titulo,
            conteudo: val.conteudo,
            descricaoCurta: val.conteudoCurto,
            image: val.image,
            slug: val.slug,
            categoria: val.categoria,
          };
        });

        Noticias.find(
          { titulo: { $regex: req.query.busca, $options: "i" } },
          function (err, noticias) {
            noticias = noticias.map(function (val) {
              return {
                titulo: val.titulo,
                conteudo: val.conteudo,
                descricaoCurta: val.conteudoCurto,
                image: val.image,
                slug: val.slug,
                categoria: val.categoria,
              };
            });

            res.render("busca", { posts: posts, contagem: posts.length, noticias: noticias, contagem2: noticias.length });
          }
        );
      }
    )
  }
});

app.get("/contribua", (req, res) => {
  if (req.query.busca == null) {
    res.render("contribua", {});
  } else {
    Posts.find(
      { titulo: { $regex: req.query.busca, $options: "i" } },
      function (err, posts) {
        posts = posts.map(function (val) {
          return {
            titulo: val.titulo,
            conteudo: val.conteudo,
            descricaoCurta: val.conteudoCurto,
            image: val.image,
            slug: val.slug,
            categoria: val.categoria,
          };
        });

        Noticias.find(
          { titulo: { $regex: req.query.busca, $options: "i" } },
          function (err, noticias) {
            noticias = noticias.map(function (val) {
              return {
                titulo: val.titulo,
                conteudo: val.conteudo,
                descricaoCurta: val.conteudoCurto,
                image: val.image,
                slug: val.slug,
                categoria: val.categoria,
              };
            });

            res.render("busca", { posts: posts, contagem: posts.length, noticias: noticias, contagem2: noticias.length });
          }
        );
      }
    )
  }
});

app.get("/sobre", (req, res) => {
  if (req.query.busca == null) {
    res.render("sobre", {});
  } else {
    Posts.find(
      { titulo: { $regex: req.query.busca, $options: "i" } },
      function (err, posts) {
        posts = posts.map(function (val) {
          return {
            titulo: val.titulo,
            conteudo: val.conteudo,
            descricaoCurta: val.conteudoCurto,
            image: val.image,
            slug: val.slug,
            categoria: val.categoria,
          };
        });

        Noticias.find(
          { titulo: { $regex: req.query.busca, $options: "i" } },
          function (err, noticias) {
            noticias = noticias.map(function (val) {
              return {
                titulo: val.titulo,
                conteudo: val.conteudo,
                descricaoCurta: val.conteudoCurto,
                image: val.image,
                slug: val.slug,
                categoria: val.categoria,
              };
            });

            res.render("busca", { posts: posts, contagem: posts.length, noticias: noticias, contagem2: noticias.length });
          }
        );
      }
    )
  }
});

app.get("/estudos", (req, res) => {
  if (req.query.busca == null) {
    Estudos.find({})
      .sort({ _id: -1 })
      .exec(function (err, estudos) {
        estudos = estudos.map(function (val) {
          return {
            titulo: val.titulo,
            image: val.image,
            conteudo: val.conteudo,
            conteudoCurto: val.conteudoCurto,
            url: val.url,
            categoria: val.categoria,
          };
        });

        res.render("estudos", { estudos: estudos });
      });
  } else {
    Posts.find(
      { titulo: { $regex: req.query.busca, $options: "i" } },
      function (err, posts) {
        posts = posts.map(function (val) {
          return {
            titulo: val.titulo,
            conteudo: val.conteudo,
            descricaoCurta: val.conteudoCurto,
            image: val.image,
            slug: val.slug,
            categoria: val.categoria,
          };
        });

        Noticias.find(
          { titulo: { $regex: req.query.busca, $options: "i" } },
          function (err, noticias) {
            noticias = noticias.map(function (val) {
              return {
                titulo: val.titulo,
                conteudo: val.conteudo,
                descricaoCurta: val.conteudoCurto,
                image: val.image,
                slug: val.slug,
                categoria: val.categoria,
              };
            });

            res.render("busca", { posts: posts, contagem: posts.length, noticias: noticias, contagem2: noticias.length });
          }
        );
      }
    )
  }
});

app.get("/faleconosco", (req, res) => {
  if (req.query.busca == null) {
    res.render("faleConosco");
  } else {
    Posts.find(
      { titulo: { $regex: req.query.busca, $options: "i" } },
      function (err, posts) {
        posts = posts.map(function (val) {
          return {
            titulo: val.titulo,
            conteudo: val.conteudo,
            descricaoCurta: val.conteudoCurto,
            image: val.image,
            slug: val.slug,
            categoria: val.categoria,
          };
        });

        Noticias.find(
          { titulo: { $regex: req.query.busca, $options: "i" } },
          function (err, noticias) {
            noticias = noticias.map(function (val) {
              return {
                titulo: val.titulo,
                conteudo: val.conteudo,
                descricaoCurta: val.conteudoCurto,
                image: val.image,
                slug: val.slug,
                categoria: val.categoria,
              };
            });

            res.render("busca", { posts: posts, contagem: posts.length, noticias: noticias, contagem2: noticias.length });
          }
        );
      }
    )
  }
});

app.get("/post/:slug", (req, res) => {
  if (req.query.busca == null) {
    Posts.findOneAndUpdate(
      { slug: req.params.slug },
      { new: true },
      function (err, resposta) {
        if (resposta != null) {
          Posts.find({})
            .sort({ _id: -1 })
            .limit(3)
            .exec(function (err, ultimas) {
              ultimas = ultimas.map(function (val) {
                return {
                  titulo: val.titulo,
                  image: val.image,
                  conteudo: val.conteudo,
                  conteudoCurto: val.conteudoCurto,
                  slug: val.slug,
                  categoria: val.categoria,
                };
              });

              res.render("single", { noticia: resposta, ultimas: ultimas });
            });
        } else {
          res.redirect("/");
        }
      }
    );
  } else {
    Posts.find(
      { titulo: { $regex: req.query.busca, $options: "i" } },
      function (err, posts) {
        posts = posts.map(function (val) {
          return {
            titulo: val.titulo,
            conteudo: val.conteudo,
            descricaoCurta: val.conteudoCurto,
            image: val.image,
            slug: val.slug,
            categoria: val.categoria,
          };
        });

        Noticias.find(
          { titulo: { $regex: req.query.busca, $options: "i" } },
          function (err, noticias) {
            noticias = noticias.map(function (val) {
              return {
                titulo: val.titulo,
                conteudo: val.conteudo,
                descricaoCurta: val.conteudoCurto,
                image: val.image,
                slug: val.slug,
                categoria: val.categoria,
              };
            });

            res.render("busca", { posts: posts, contagem: posts.length, noticias: noticias, contagem2: noticias.length });
          }
        );
      }
    )
  }
});

app.get("/noticia/:slug", (req, res) => {
  if (req.query.busca == null) {
    Noticias.findOneAndUpdate(
      { slug: req.params.slug },
      { new: true },
      function (err, noticia) {
        if (noticia != null) {
          Noticias.find({})
            .sort({ _id: -1 })
            .limit(3)
            .exec(function (err, ultimas) {
              ultimas = ultimas.map(function (val) {
                return {
                  titulo: val.titulo,
                  image: val.image,
                  conteudo: val.conteudo,
                  conteudoCurto: val.conteudoCurto,
                  slug: val.slug,
                  categoria: val.categoria,
                };
              });

              res.render("singleNoticia", { noticia: noticia, ultimas: ultimas });
            });
        } else {
          res.redirect("/");
        }
      }
    );
  } else {
    Posts.find(
      { titulo: { $regex: req.query.busca, $options: "i" } },
      function (err, posts) {
        posts = posts.map(function (val) {
          return {
            titulo: val.titulo,
            conteudo: val.conteudo,
            descricaoCurta: val.conteudoCurto,
            image: val.image,
            slug: val.slug,
            categoria: val.categoria,
          };
        });

        Noticias.find(
          { titulo: { $regex: req.query.busca, $options: "i" } },
          function (err, noticias) {
            noticias = noticias.map(function (val) {
              return {
                titulo: val.titulo,
                conteudo: val.conteudo,
                descricaoCurta: val.conteudoCurto,
                image: val.image,
                slug: val.slug,
                categoria: val.categoria,
              };
            });

            res.render("busca", { posts: posts, contagem: posts.length, noticias: noticias, contagem2: noticias.length });
          }
        );
      }
    )
  }
});

app.listen(5000, () => {
  console.log("server rodando!");
});
