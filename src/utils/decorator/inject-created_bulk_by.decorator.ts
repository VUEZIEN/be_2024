import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const InjectBulkCreatedBy = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    if (Array.isArray(req.body.data)) {
      req.body.data = req.body.data.map((item) => ({
        ...item,
        created_by: { id: req.user.id },
      }));
    }
    return req.body;
  },
);
