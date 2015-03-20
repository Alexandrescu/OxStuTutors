'use strict';

module.exports = function (req, res) {
  var workflow = new (require('events').EventEmitter)();

  workflow.outcome = {
    success: false,
    errors: []
  };

  workflow.hasErrors = function () {
    return workflow.outcome.errors.length !== 0;
  };

  workflow.on('exception', function (err) {
    workflow.outcome.errors.push('Exception: ' + err);
    return workflow.emit('response');
  });

  workflow.on('response', function () {
    workflow.outcome.success = !workflow.hasErrors();

    var statusCode = 200;
    if(!workflow.outcome.success) {
      statusCode = 404;
    }

    res.status(statusCode).send(workflow.outcome);
  });

  return workflow;
};
