import { Repository, injectable } from "@cole-framework/api-core";
import { Foo, Foo } from "../entities/foo";

export abstract class FooRepository extends Repository<Foo> {}
