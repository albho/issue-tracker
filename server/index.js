const express = require("express");
const PORT = 3001;
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// JWT VERIFICATION
const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(401).send("Missing token!");
  } else {
    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        res.json({ auth: false, message: "Token not verified!" });
      } else {
        req.userId = decoded.id;
        return next();
      }
    });
  }
};

// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM users WHERE email = ?", email, (err, result) => {
    if (err) {
      console.log(err.message);
    }

    if (result.length) {
      bcrypt.compare(password, result[0].password, (error, response) => {
        if (response) {
          const id = result[0].id;
          const token = jwt.sign({ id }, JWT_SECRET_KEY, {
            expiresIn: 60 * 60 * 24 * 60, // 60 days
          });
          res.json({ auth: true, token, result });
        } else {
          res.json({ auth: false, message: "Wrong email or password!" });
        }
      });
    } else {
      res.json({ auth: false, message: "User does not exist!" });
    }
  });
});

// REGISTER
app.post("/register", (req, res) => {
  const { firstName, lastName, email, password, company, isAdmin } = req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.log(err.message);
    }

    const register = () =>
      db.query(
        // FIND COMPANY
        "SELECT * FROM companies WHERE company_name = ?",
        company,
        (err, result) => {
          if (err) {
            console.log(err.message);
            // IF COMPANY DOES NOT EXIST, CREATE NEW COMPANY AND RE-RUN QUERY
          } else if (result.length === 0) {
            db.query(
              "INSERT INTO companies (company_name) VALUES (?)",
              company,
              (err) => {
                if (err) {
                  console.log(err.message);
                } else {
                  register();
                }
              }
            );
            // IF COMPANY DOES EXIST, REGISTER USER
          } else if (result) {
            const companyId = result[0].company_id;
            db.query(
              "INSERT INTO users (first_name, last_name, email, password, is_admin, fk_company_id, register_date) VALUES (?, ?, ?, ?, ?, ?, ?)",
              [
                firstName,
                lastName,
                email,
                hash,
                isAdmin,
                companyId,
                new Date(),
              ],
              (err, result) => {
                if (err) {
                  console.log(err.message);
                } else {
                  res.send(result);
                }
              }
            );
          }
        }
      );
    register();
  });
});

// CHECK AUTHENTICATION
app.get("/checkauth", verifyJWT, (req, res) => {
  res.json({ auth: true, message: "Authenticated" });
});

// GET CURRENT USER INFO
app.get("/account/:userId", verifyJWT, (req, res) => {
  db.query(
    "SELECT * FROM users WHERE user_id = ?",
    [req.params.userId],
    (err, result) => {
      if (err) {
        console.log(err.message);
      } else {
        res.json({ message: "User retrieved", result });
      }
    }
  );
});

// GET COMPANY EMPLOYEES
app.get("/employees/:companyId", verifyJWT, (req, res) => {
  db.query(
    "SELECT * FROM users WHERE fk_company_id = ?",
    [req.params.companyId],
    (err, result) => {
      if (err) {
        console.log(err.message);
      } else {
        res.json({ message: "Employees retrieved", result });
      }
    }
  );
});

// *** CRUD OPERATIONS *** //
// CREATE PROJECT
app.post("/create/project", verifyJWT, (req, res) => {
  db.query(
    "INSERT INTO projects (project_title, project_description, fk_project_author_id, fk_project_company_id, project_create_date) VALUES (?, ?, ?, ?, ?)",
    [
      req.body.title,
      req.body.description,
      req.body.userId,
      req.body.companyId,
      new Date(),
    ],
    (err, result) => {
      if (err) {
        console.log(err.message);
      } else {
        res.json({ message: "Project created", result });
      }
    }
  );
});

// CREATE PROJECT TEAM
app.post("/create/project/team/:projectId", verifyJWT, (req, res) => {
  db.query(
    "INSERT INTO project_team (team_member_id, team_project_id) VALUES (?, ?)",
    [req.body.memberId, req.params.projectId],
    (err, result) => {
      if (err) {
        console.log(err.message);
      } else {
        res.json({ message: "Team created", result });
      }
    }
  );
});

// CREATE TICKET
app.post(
  "/create/ticket/:companyId/:projectId/:userId",
  verifyJWT,
  (req, res) => {
    // if no assignee, leave it as null, do not insert anything
    if (req.body.assignee === 0) {
      db.query(
        "INSERT INTO tickets (ticket_title, ticket_description, status, priority, type, time_estimate, fk_ticket_author_id, fk_ticket_project_id, fk_ticket_company_id, ticket_create_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          req.body.title,
          req.body.description,
          req.body.status,
          req.body.priority,
          req.body.type,
          req.body.time,
          req.params.userId,
          req.params.projectId,
          req.params.companyId,
          new Date(),
        ],
        (err, result) => {
          if (err) {
            console.log(err.message);
          } else {
            res.json({ message: "Ticket created", result });
          }
        }
      );
    } else {
      // else, populate assignee field
      db.query(
        "INSERT INTO tickets (ticket_title, ticket_description, status, priority, type, time_estimate, fk_assignee_id, fk_ticket_author_id, fk_ticket_project_id, fk_ticket_company_id, ticket_create_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          req.body.title,
          req.body.description,
          req.body.status,
          req.body.priority,
          req.body.type,
          req.body.time,
          req.body.assignee || NULL,
          req.params.userId,
          req.params.projectId,
          req.params.companyId,
          new Date(),
        ],
        (err, result) => {
          if (err) {
            console.log(err.message);
          } else {
            res.json({ message: "Ticket created", result });
          }
        }
      );
    }
  }
);

// CREATE TICKET COMMENT
app.post("/create/comment/:ticketId", verifyJWT, (req, res) => {
  db.query(
    "INSERT INTO ticket_comments (comment, comment_date, fk_comment_author_id, fk_ticket_id) VALUES (?, ?, ?, ?)",
    [req.body.comment, new Date(), req.body.userId, req.params.ticketId],
    (err, result) => {
      if (err) {
        console.log(err.message);
      } else {
        res.json({ message: "Comment created", result });
      }
    }
  );
});

// GET ALL PROJECTS OF A COMPANY
app.get("/view/projects/:companyId", verifyJWT, (req, res) => {
  db.query(
    "SELECT first_name, last_name, phone, email, is_admin, project_id, project_title, project_description, project_create_date, fk_project_author_id FROM projects INNER JOIN users ON users.user_id = projects.fk_project_author_id WHERE fk_project_company_id = ? ORDER BY project_create_date DESC",
    [req.params.companyId],
    (err, result) => {
      if (err) {
        console.log(err.message);
      } else {
        res.json({ message: "Project retrieved", result });
      }
    }
  );
});

// GET ALL TICKETS OF A PROJECT
app.get("/view/tickets/:projectId", verifyJWT, (req, res) => {
  db.query(
    "SELECT * FROM tickets WHERE fk_ticket_project_id = ?",
    [req.params.projectId],
    (err, result) => {
      if (err) {
        console.log(err.message);
      } else {
        res.json({ message: "Tickets retrieved", result });
      }
    }
  );
});

// GET ALL MEMBERS OF A PROJECT TEAM
app.get("/view/project/team/:projectId", verifyJWT, (req, res) => {
  db.query(
    "SELECT user_id, first_name, last_name, phone, email FROM users INNER JOIN project_team ON users.user_id = project_team.team_member_id WHERE team_project_id = ?",
    [req.params.projectId],
    (err, result) => {
      if (err) {
        console.log(err.message);
      } else {
        res.send({ message: "Team retrieved", result });
      }
    }
  );
});

// GET ALL COMMENTS OF A TICKET
app.get("/view/comments/:ticketId", verifyJWT, (req, res) => {
  db.query(
    "SELECT * FROM ticket_comments INNER JOIN users ON ticket_comments.fk_comment_author_id = users.user_id WHERE fk_ticket_id = ?",
    [req.params.ticketId],
    (err, result) => {
      if (err) {
        console.log(err.message);
      } else {
        res.send({ message: "Comments retrieved", result });
      }
    }
  );
});

// UPDATE PROJECT
app.put("/update/project/:projectId", verifyJWT, (req, res) => {
  db.query(
    "UPDATE projects SET project_title = ?, project_description = ?, project_update_date = ? WHERE project_id = ?",
    [req.body.title, req.body.description, new Date(), req.params.projectId],
    (err, result) => {
      if (err) {
        console.log(err.message);
      } else {
        res.json({ message: "Project updated", result });
      }
    }
  );
});

// UPDATE TICKET
app.put("/update/ticket/:ticketId", verifyJWT, (req, res) => {
  if (req.body.assignee === 0) {
    db.query(
      "UPDATE tickets SET ticket_title = ?, ticket_description = ?, status = ?, priority = ?, type = ?, time_estimate = ?, fk_assignee_id = NULL, fk_ticket_author_id = ?, fk_ticket_project_id = ?, fk_ticket_company_id = ?, ticket_update_date = ? WHERE ticket_id = ?",
      [
        req.body.title,
        req.body.description,
        req.body.status,
        req.body.priority,
        req.body.type,
        req.body.time,
        req.body.userId,
        req.body.projectId,
        req.body.companyId,
        new Date(),
        req.params.ticketId,
      ],
      (err, result) => {
        if (err) {
          console.log(err.message);
        } else {
          res.json({ message: "Ticket updated", result });
        }
      }
    );
  } else {
    db.query(
      "UPDATE tickets SET ticket_title = ?, ticket_description = ?, status = ?, priority = ?, type = ?, time_estimate = ?, fk_assignee_id = ?, fk_ticket_author_id = ?, fk_ticket_project_id = ?, fk_ticket_company_id = ?, ticket_update_date = ? WHERE ticket_id = ?",
      [
        req.body.title,
        req.body.description,
        req.body.status,
        req.body.priority,
        req.body.type,
        req.body.time,
        req.body.assignee,
        req.body.userId,
        req.body.projectId,
        req.body.companyId,
        new Date(),
        req.params.ticketId,
      ],
      (err, result) => {
        if (err) {
          console.log(err.message);
        } else {
          res.json({ message: "Ticket updated", result });
        }
      }
    );
  }
});

// DELETE PROJECT
app.delete("/delete/project/:projectId", verifyJWT, (req, res) => {
  db.query(
    "DELETE FROM projects WHERE project_id = ?",
    [req.params.projectId],
    (err, result) => {
      if (err) {
        console.log("Eh!");
        console.log(err.message);
      } else {
        res.json({ message: "Project deleted", result });
      }
    }
  );
});

// DELETE PROJECT TEAM (for updating a project's team - delete all, then create new list)
app.delete("/delete/project/team/:projectId", verifyJWT, (req, res) => {
  db.query("DELETE FROM project_team WHERE team_project_id = ?", [
    [req.params.projectId],
    (err, result) => {
      if (err) {
        console.log(err.message);
      } else {
        res.json({ message: "Team deleted", result });
      }
    },
  ]);
});

// DELETE TICKET
app.delete("/delete/ticket/:ticketId", verifyJWT, (req, res) => {
  db.query(
    "DELETE FROM tickets WHERE ticket_id = ?",
    [req.params.ticketId],
    (err, result) => {
      if (err) {
        console.log(err.message);
      } else {
        res.json({ message: "Ticket deleted", result });
      }
    }
  );
});

// DELETE COMMENT
app.delete("/delete/comment/:commentId", verifyJWT, (req, res) => {
  db.query(
    "DELETE FROM ticket_comments WHERE comment_id = ?",
    [req.params.commentId],
    (err, result) => {
      if (err) {
        console.log(err.message);
      } else {
        res.json({ message: "Comment deleted", result });
      }
    }
  );
});

// ERROR HANDLING
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no, something went wrong!";
  res.status(statusCode).render("error", { err });
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
