/*
  Copyright 2020-2021 Lowdefy, Inc

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import createGetController from './getController';
import { testBootstrapContext } from '../test/testContext';
import { PageController } from '../controllers/pageController';
import { ComponentController } from '../controllers/componentController';
import { RequestController } from '../controllers/requestController';

test('get page controller', () => {
  const getController = createGetController(testBootstrapContext());
  const controller = getController('page');
  expect(controller).toBeInstanceOf(PageController);
});

test('get component controller', () => {
  const getController = createGetController(testBootstrapContext());
  const controller = getController('component');
  expect(controller).toBeInstanceOf(ComponentController);
});

test('get request controller', () => {
  const getController = createGetController(testBootstrapContext());
  const controller = getController('request');
  expect(controller).toBeInstanceOf(RequestController);
});

test('memoise controller', () => {
  const getController = createGetController(testBootstrapContext());
  const controller1 = getController('page');
  const controller2 = getController('page');
  expect(controller1).toBe(controller2);
});
