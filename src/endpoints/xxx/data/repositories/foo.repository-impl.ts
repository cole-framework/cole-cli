import {
  DataContext,
  Repository,
  RepositoryImpl,
} from "@cole-framework/api-core";
import { Foo } from "../../domain/entities/foo";
import { FooRepository } from "../../domain/repositories/foo.repository";
import { FooMongoModel, FooMysqlModel } from "../dtos/foo.dto";

export class FooRepositoryImpl
  extends RepositoryImpl<Foo, FooMongoModel>
  implements FooRepository
{
  constructor(
    mongoContext: DataContext<Foo, FooMongoModel>,
    mysqlContext: DataContext<Foo, FooMysqlModel>,
  ) {
    super(mongoContext);
  }
}
