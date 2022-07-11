import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'metatrail/config/environment';
import Buffer from 'buffer';

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

window.global = window;
window.Buffer = Buffer.Buffer;

loadInitializers(App, config.modulePrefix);
