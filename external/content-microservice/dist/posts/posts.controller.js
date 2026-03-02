'use strict';
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
            ? (desc = Object.getOwnPropertyDescriptor(target, key))
            : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return (c > 3 && r && Object.defineProperty(target, key, r), r);
  };
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function')
      return Reflect.metadata(k, v);
  };
var __param =
  (this && this.__param) ||
  function (paramIndex, decorator) {
    return function (target, key) {
      decorator(target, key, paramIndex);
    };
  };
var PostsController_1;
Object.defineProperty(exports, '__esModule', { value: true });
exports.PostsController = void 0;
const common_1 = require('@nestjs/common');
const microservices_1 = require('@nestjs/microservices');
const createPost_service_1 = require('./services/createPost.service');
const findAllPosts_service_1 = require('./services/findAllPosts.service');
const findOnePost_service_1 = require('./services/findOnePost.service');
const updatePost_service_1 = require('./services/updatePost.service');
const removePost_service_1 = require('./services/removePost.service');
const create_post_dto_1 = require('./dto/create-post.dto');
const update_post_dto_1 = require('./dto/update-post.dto');
const users_service_1 = require('../users/users.service');
const common_2 = require('../common');
let PostsController = (PostsController_1 = class PostsController {
  createPostService;
  findAllPostsService;
  findOnePostService;
  updatePostService;
  removePostService;
  usersService;
  logger = new common_1.Logger(PostsController_1.name);
  constructor(
    createPostService,
    findAllPostsService,
    findOnePostService,
    updatePostService,
    removePostService,
    usersService,
  ) {
    this.createPostService = createPostService;
    this.findAllPostsService = findAllPostsService;
    this.findOnePostService = findOnePostService;
    this.updatePostService = updatePostService;
    this.removePostService = removePostService;
    this.usersService = usersService;
  }
  async create(createPostDto) {
    // Poll for the user ref so transient replication delays don't immediately fail
    const maxAttempts = 12;
    const delayMs = 5000;
    let userRef = null;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      userRef = await this.usersService.get(createPostDto.sql_user_id);
      if (userRef) break;
      this.logger.warn(
        `User ref not found for ${createPostDto.sql_user_id}, attempt ${attempt + 1}/${maxAttempts}. Waiting ${delayMs}ms before retrying.`,
      );
      await new Promise((r) => setTimeout(r, delayMs));
    }
    if (!userRef) {
      this.logger.error(
        `No user ref found for ${createPostDto.sql_user_id}. ` +
          'Ensure auth.tokenGenerated was received.',
      );
      common_2.RpcExceptionHelper.unauthorized(
        'User not replicated yet. Authenticate first.',
      );
      return;
    }
    return this.createPostService.create(createPostDto, {
      _token: userRef.token,
    });
  }
  findAll(pagination) {
    return this.findAllPostsService.execute(pagination);
  }
  findOne(id) {
    return this.findOnePostService.execute(id);
  }
  update(updatePostDto) {
    return this.updatePostService.execute(updatePostDto.id, updatePostDto);
  }
  remove(id) {
    return this.removePostService.execute(id);
  }
});
exports.PostsController = PostsController;
__decorate(
  [
    (0, microservices_1.MessagePattern)('createPost'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [create_post_dto_1.CreatePostDto]),
    __metadata('design:returntype', Promise),
  ],
  PostsController.prototype,
  'create',
  null,
);
__decorate(
  [
    (0, microservices_1.MessagePattern)('findAllPosts'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [common_2.PaginationDto]),
    __metadata('design:returntype', void 0),
  ],
  PostsController.prototype,
  'findAll',
  null,
);
__decorate(
  [
    (0, microservices_1.MessagePattern)('findOnePost'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [String]),
    __metadata('design:returntype', void 0),
  ],
  PostsController.prototype,
  'findOne',
  null,
);
__decorate(
  [
    (0, microservices_1.MessagePattern)('updatePost'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [update_post_dto_1.UpdatePostDto]),
    __metadata('design:returntype', void 0),
  ],
  PostsController.prototype,
  'update',
  null,
);
__decorate(
  [
    (0, microservices_1.MessagePattern)('removePost'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [String]),
    __metadata('design:returntype', void 0),
  ],
  PostsController.prototype,
  'remove',
  null,
);
exports.PostsController =
  PostsController =
  PostsController_1 =
    __decorate(
      [
        (0, common_1.Controller)(),
        __metadata('design:paramtypes', [
          createPost_service_1.createPostService,
          findAllPosts_service_1.FindAllPostsService,
          findOnePost_service_1.FindOnePostService,
          updatePost_service_1.UpdatePostService,
          removePost_service_1.RemovePostService,
          users_service_1.UsersService,
        ]),
      ],
      PostsController,
    );
//# sourceMappingURL=posts.controller.js.map
