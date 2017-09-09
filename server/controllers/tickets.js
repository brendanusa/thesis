const models = require('../../db/models');
const dbhelper = require('../../db/helpers.js');
const helper = require('./helper');

module.exports.getPanelTickets = (req, res) => {
  if (helper.checkUndefined(req.params.panel_id)) {
    res.status(400).send('one of parameters from client is undefined');
  }
  var panelId = req.params.panel_id;
  dbhelper.getTicketsByPanel(panelId)
    .then(tickets => {
      if (!tickets) {
        throw 'cant get tickets by panel id';
      }
      res.status(200).send(tickets);
    })
    .catch(err => {
      // This code indicates an outside service (the database) did not respond in time
      res.status(500).send(JSON.stringify(err));
    });
};

module.exports.createPanelTicket = (req, res) => {
  if (helper.checkUndefined(
    req.body.title,
    req.body.description,
    req.body.status,
    req.body.priority,
    req.body.type,
    req.body.assignee_id,
    req.body.board_id,
    req.body.panel_id
  )) {
    res.status(400).send('one of parameters from client is undefined');
  }
  var ticketObj = {
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
    priority: req.body.priority,
    type: req.body.type,
    creator_id: req.user.id,
    assignee_id: req.body.assignee_id,
    board_id: req.body.board_id,
    panel_id: req.body.panel_id
  };
  dbhelper.createTicket(ticketObj)
    .then(result => {
      if (!result) {
        throw 'cant create ticket';
      }
      res.status(201).send(result);
    })
    .catch(err => {
      res.status(500).send(JSON.stringify(err));
    });
};

module.exports.getOneTicket = (req, res) => {
  if (helper.checkUndefined(req.params.id)) {
    res.status(400).send('one of parameters from client is undefined');
  }
  var ticketId = req.params.id;
  dbhelper.getTicketById(ticketId)
    .then(ticket => {
      if (!ticket) {
        throw 'cant get ticket by id';
      }
      res.status(200).send(ticket);
    })
    .catch((err) => {
      res.status(500).send(JSON.stringify(err));
    });
};

module.exports.updateTicket = (req, res) => {
  if (helper.checkUndefined(req.body)) {
    res.status(400).send('one of parameters from client is undefined');
  }
  var ticketObj = req.body;
  var validKeys = {
    'id': true,
    'title': true,
    'description': true,
    'status': true,
    'priority': true,
    'type': true,
    'creator_id': true,
    'assignee_id': true,
    'board_id': true,
    'panel_id': true
  };
  for (var key in ticketObj) {
    if (ticketObj.hasOwnProperty(key)) {
      if (!(key in validKeys)) {
        res.status(400).send(`${key} not a valid field`);
      }
    }
  }
  var ticketlId = ticketObj.id;
  if (!ticketId) {
    res.status(400).send(`Update panel object ${JSON.stringify(ticketlId)} doesnt have id field`);
  }
  dbhelper.updateTicketById(ticketId, ticketObj)
    .then((ticket) => {
      if (!ticket) {
        throw 'cant update ticket by id';
      }
      res.sendStatus(201);
    })
    .catch(err => {
      res.status(500).send(JSON.stringify(err));
    });
};

module.exports.deleteOne = (req, res) => {
  if (helper.checkUndefined(req.params.id)) {
    res.status(400).send('one of parameters from client is undefined');
  }
  models.Ticket.where({ id: req.params.id }).fetch()
    .then(ticket => {
      if (!ticket) {
        throw ticket;
      }
      return ticket.destroy();
    })
    .then(() => {
      res.sendStatus(200);
    })
    .error(err => {
      res.status(503).send(err);
    })
    .catch(() => {
      res.sendStatus(404);
    });
};