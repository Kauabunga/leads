'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var feedbackCtrlStub = {
  index: 'feedbackCtrl.index',
  show: 'feedbackCtrl.show',
  create: 'feedbackCtrl.create',
  update: 'feedbackCtrl.update',
  destroy: 'feedbackCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var feedbackIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './feedback.controller': feedbackCtrlStub
});

describe('Feedback API Router:', function() {

  it('should return an express router instance', function() {
    feedbackIndex.should.equal(routerStub);
  });

  describe('GET /api/feedbacks', function() {

    it('should route to feedback.controller.index', function() {
      routerStub.get
        .withArgs('/', 'feedbackCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/feedbacks/:id', function() {

    it('should route to feedback.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'feedbackCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/feedbacks', function() {

    it('should route to feedback.controller.create', function() {
      routerStub.post
        .withArgs('/', 'feedbackCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/feedbacks/:id', function() {

    it('should route to feedback.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'feedbackCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/feedbacks/:id', function() {

    it('should route to feedback.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'feedbackCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/feedbacks/:id', function() {

    it('should route to feedback.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'feedbackCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
