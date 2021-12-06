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

// CHECK AUTHENTICATION
app.get("/checkauth", verifyJWT, (req, res) => {
  res.json({ auth: true, message: "Authenticated" });
});

// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM users WHERE email = ?", email, (err, result) => {
    if (err) {
      console.log("Error: login", err.message);
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

// CHECK IF COMPANY EXISTS
app.get("/register/:companyName", (req, res) => {
  db.query(
    "SELECT DISTINCT company_name FROM companies WHERE UPPER(company_name) = UPPER(?)",
    [req.params.companyName],
    (err, result) => {
      if (err) {
        console.log("Error: retrieving company info", err.message);
      } else {
        res.json({ message: "Company retrieved", result });
      }
    }
  );
});

// CHECK IF EMAIL EXISTS
app.get("/register/user/:email", (req, res) => {
  db.query(
    "SELECT DISTINCT email FROM users WHERE UPPER(email) = UPPER(?)",
    [req.params.email],
    (err, result) => {
      if (err) {
        console.log("Error: retrieving user email", err.message);
      } else {
        res.json({ message: "User email retrieved", result });
      }
    }
  );
});

// REGISTER
app.post("/register", (req, res) => {
  const { fullName, email, password, company, isAdmin } = req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.log("Error: register", err.message);
    }

    const register = () =>
      db.query(
        // FIND COMPANY
        "SELECT * FROM companies WHERE company_name = ?",
        company,
        (err, result) => {
          if (err) {
            console.log("Error: finding company", err.message);
            // IF COMPANY DOES NOT EXIST, CREATE NEW COMPANY AND RE-RUN QUERY
          } else if (result.length === 0) {
            db.query(
              "INSERT INTO companies (company_name) VALUES (?)",
              company,
              (err) => {
                if (err) {
                  console.log("Error: registering company", err.message);
                } else {
                  register();
                }
              }
            );
            // IF COMPANY DOES EXIST, REGISTER USER
          } else if (result) {
            const companyId = result[0].company_id;
            db.query(
              "INSERT INTO users (full_name, email, password, is_admin, fk_company_id, register_date) VALUES (?, ?, ?, ?, ?, ?, ?)",
              [fullName, email, hash, isAdmin, companyId, new Date()],
              (err, result) => {
                if (err) {
                  console.log("Error: registering user", err.message);
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

// CREATE PROJECT
app.post("/create/project", verifyJWT, (req, res) => {
  if (req.body.deadline) {
    db.query(
      "INSERT INTO projects (project_title, project_description, project_deadline, fk_project_author_id, fk_project_company_id, project_create_date) VALUES (?, ?, ?, ?, ?, ?)",
      [
        req.body.title,
        req.body.description,
        req.body.deadline,
        req.body.userId,
        req.body.companyId,
        req.body.createDate,
      ],
      (err, result) => {
        if (err) {
          console.log("Error: creating a project with deadline", err.message);
        } else {
          res.json({ message: "Project created", result });
        }
      }
    );
  } else {
    db.query(
      "INSERT INTO projects (project_title, project_description, fk_project_author_id, fk_project_company_id, project_create_date) VALUES (?, ?, ?, ?, ?)",
      [
        req.body.title,
        req.body.description,
        req.body.userId,
        req.body.companyId,
        req.body.createDate,
      ],
      (err, result) => {
        if (err) {
          console.log("Error: creating a project with deadline", err.message);
        } else {
          res.json({ message: "Project created", result });
        }
      }
    );
  }
});

// CREATE PROJECT TEAM
app.post("/create/project/team/:projectId", verifyJWT, (req, res) => {
  db.query(
    "INSERT INTO project_team (team_member_id, team_project_id) VALUES (?, ?)",
    [req.body.memberId, req.params.projectId],
    (err, result) => {
      if (err) {
        console.log("Error: creating a project team", err.message);
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
    db.query(
      "INSERT INTO tickets (ticket_title, ticket_description, status, priority, type, time_estimate, fk_assignee_id, fk_ticket_author_id, fk_ticket_project_id, fk_ticket_company_id, ticket_create_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        req.body.title,
        req.body.description,
        req.body.status,
        req.body.priority,
        req.body.type,
        req.body.time,
        req.body.assignee,
        req.params.userId,
        req.params.projectId,
        req.params.companyId,
        new Date(),
      ],
      (err, result) => {
        if (err) {
          console.log("Error: creating a ticket", err.message);
        } else {
          res.json({ message: "Ticket created", result });
        }
      }
    );
  }
);

// CREATE TICKET COMMENT
app.post("/create/comment/:ticketId", verifyJWT, (req, res) => {
  db.query(
    "INSERT INTO ticket_comments (comment, comment_date, fk_comment_author_id, fk_ticket_id) VALUES (?, ?, ?, ?)",
    [req.body.comment, new Date(), req.body.userId, req.params.ticketId],
    (err, result) => {
      if (err) {
        console.log("Error: creating a comment", err.message);
      } else {
        res.json({ message: "Comment created", result });
      }
    }
  );
});

// GET CURRENT USER INFO
app.get("/account/:userId", verifyJWT, (req, res) => {
  db.query(
    "SELECT * FROM users WHERE user_id = ?",
    [req.params.userId],
    (err, result) => {
      if (err) {
        console.log("Error: retrieving user info", err.message);
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
        console.log("Error: retrieving company employees", err.message);
      } else {
        res.json({ message: "Employees retrieved", result });
      }
    }
  );
});

// GET ALL PROJECTS OF A COMPANY
app.get("/view/projects/:companyId", verifyJWT, (req, res) => {
  db.query(
    "SELECT * FROM projects INNER JOIN users ON projects.fk_project_author_id = users.user_id WHERE fk_project_company_id = ? ORDER BY project_create_date DESC",
    [req.params.companyId],
    (err, result) => {
      if (err) {
        console.log("Error: retrieving projects", err.message);
      } else {
        res.json({ message: "Projects retrieved", result });
      }
    }
  );
});

// GET A SINGLE PROJECT
app.get("/view/:projectId", verifyJWT, (req, res) => {
  db.query(
    "SELECT project_title, project_description, project_deadline, project_create_date, project_update_date, authors.user_id AS 'author_user_id', authors.full_name AS 'author_full_name', updaters.user_id AS 'updater_user_id', updaters.full_name AS 'updater_full_name', updaters.email AS 'updater_email' FROM projects INNER JOIN users authors ON projects.fk_project_author_id = authors.user_id LEFT JOIN users updaters ON projects.fk_project_updated_by = updaters.user_id WHERE project_id = ?",
    [req.params.projectId],
    (err, result) => {
      if (err) {
        console.log("Error: retrieving a project", err.message);
      } else {
        res.json({ message: "Project retrieved", result });
      }
    }
  );
});

// GET ALL TICKETS OF A PROJECT
app.get("/view/tickets/:projectId", verifyJWT, (req, res) => {
  db.query(
    "SELECT ticket_id, ticket_title, ticket_description, priority, type, status, ticket_create_date, ticket_update_date, time_estimate, authors.user_id AS 'author_user_id', authors.full_name AS 'author_full_name', authors.email AS 'author_email', assignees.user_id AS 'assignee_user_id', assignees.full_name AS 'assignee_full_name', assignees.email AS 'assignee_email', updaters.user_id AS 'updater_user_id', updaters.full_name AS 'updater_full_name', updaters.email AS 'updater_email' FROM tickets INNER JOIN users authors ON tickets.fk_ticket_author_id = authors.user_id INNER JOIN users assignees ON tickets.fk_assignee_id = assignees.user_id LEFT JOIN users updaters ON tickets.fk_ticket_updated_by = updaters.user_id WHERE fk_ticket_project_id = ? ORDER BY ticket_create_date DESC",
    [req.params.projectId],
    (err, result) => {
      if (err) {
        console.log("Error: retrieving tickets", err.message);
      } else {
        res.json({ message: "Tickets retrieved", result });
      }
    }
  );
});

// GET ALL MEMBERS OF A PROJECT TEAM
app.get("/view/project/team/:projectId", verifyJWT, (req, res) => {
  db.query(
    "SELECT user_id, full_name, email FROM users INNER JOIN project_team ON users.user_id = project_team.team_member_id WHERE team_project_id = ?",
    [req.params.projectId],
    (err, result) => {
      if (err) {
        console.log("Error: retrieving team", err.message);
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
        console.log("Error: retrieving comments", err.message);
      } else {
        res.send({ message: "Comments retrieved", result });
      }
    }
  );
});

// UPDATE PROJECT
app.put("/update/project/:projectId", verifyJWT, (req, res) => {
  if (req.body.deadline) {
    db.query(
      "UPDATE projects SET project_title = ?, project_description = ?, project_deadline = ?, fk_project_updated_by = ?, project_update_date = ? WHERE project_id = ?",
      [
        req.body.title,
        req.body.description,
        req.body.deadline,
        req.body.updatedBy,
        req.body.updateDate,
        req.params.projectId,
      ],
      (err, result) => {
        if (err) {
          console.log("Error: updating a project with deadline", err.message);
        } else {
          res.json({ message: "Project updated", result });
        }
      }
    );
  } else {
    db.query(
      "UPDATE projects SET project_title = ?, project_description = ?, project_deadline = NULL, fk_project_updated_by = ?, project_update_date = ? WHERE project_id = ?",
      [
        req.body.title,
        req.body.description,
        req.body.updatedBy,
        req.body.updateDate,
        req.params.projectId,
      ],
      (err, result) => {
        if (err) {
          console.log(
            "Error: updating a project without deadline",
            err.message
          );
        } else {
          res.json({ message: "Project updated", result });
        }
      }
    );
  }
});

// UPDATE TICKET
app.put("/update/ticket/:ticketId", verifyJWT, (req, res) => {
  db.query(
    "UPDATE tickets SET ticket_title = ?, ticket_description = ?, status = ?, priority = ?, type = ?, time_estimate = ?, fk_assignee_id = ?, fk_ticket_updated_by = ?, ticket_update_date = ? WHERE ticket_id = ?",
    [
      req.body.title,
      req.body.description,
      req.body.status,
      req.body.priority,
      req.body.type,
      req.body.time,
      req.body.assignee,
      req.body.updatedBy,
      req.body.updateDate,
      req.params.ticketId,
    ],
    (err, result) => {
      if (err) {
        console.log("Error: updating a ticket", err.message);
      } else {
        res.json({ message: "Ticket updated", result });
      }
    }
  );
});

// DELETE PROJECT
app.delete("/delete/project/:projectId", verifyJWT, (req, res) => {
  db.query(
    "DELETE FROM projects WHERE project_id = ?",
    [req.params.projectId],
    (err, result) => {
      if (err) {
        console.log("Error: deleting a project", err.message);
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
        console.log("Error: deleting a team", err.message);
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
        console.log("Error: deleting a ticket", err.message);
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
        console.log("Error: deleting a comment", err.message);
      } else {
        res.json({ message: "Comment deleted", result });
      }
    }
  );
});

// ERROR HANDLING

// Init
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
