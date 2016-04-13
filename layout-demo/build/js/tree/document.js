var Collections, DEFAULT_TITLE, Document, DocumentChangedEvent, HasProps, ModelChangedEvent, RootAddedEvent, RootRemovedEvent, TitleChangedEvent, _, _MultiValuedDict, is_ref, logger,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

_ = require("underscore");

Collections = require("./base").Collections;

logger = require("./core/logging").logger;

HasProps = require("./core/has_props");

is_ref = require("./core/util/refs").is_ref;

DocumentChangedEvent = (function() {
  function DocumentChangedEvent(document) {
    this.document = document;
  }

  return DocumentChangedEvent;

})();

ModelChangedEvent = (function(superClass) {
  extend(ModelChangedEvent, superClass);

  function ModelChangedEvent(document, model1, attr1, old1, new_1) {
    this.document = document;
    this.model = model1;
    this.attr = attr1;
    this.old = old1;
    this.new_ = new_1;
    ModelChangedEvent.__super__.constructor.call(this, this.document);
  }

  return ModelChangedEvent;

})(DocumentChangedEvent);

TitleChangedEvent = (function(superClass) {
  extend(TitleChangedEvent, superClass);

  function TitleChangedEvent(document, title1) {
    this.document = document;
    this.title = title1;
    TitleChangedEvent.__super__.constructor.call(this, this.document);
  }

  return TitleChangedEvent;

})(DocumentChangedEvent);

RootAddedEvent = (function(superClass) {
  extend(RootAddedEvent, superClass);

  function RootAddedEvent(document, model1) {
    this.document = document;
    this.model = model1;
    RootAddedEvent.__super__.constructor.call(this, this.document);
  }

  return RootAddedEvent;

})(DocumentChangedEvent);

RootRemovedEvent = (function(superClass) {
  extend(RootRemovedEvent, superClass);

  function RootRemovedEvent(document, model1) {
    this.document = document;
    this.model = model1;
    RootRemovedEvent.__super__.constructor.call(this, this.document);
  }

  return RootRemovedEvent;

})(DocumentChangedEvent);

DEFAULT_TITLE = "Bokeh Application";

_MultiValuedDict = (function() {
  function _MultiValuedDict() {
    this._dict = {};
  }

  _MultiValuedDict.prototype._existing = function(key) {
    if (key in this._dict) {
      return this._dict[key];
    } else {
      return null;
    }
  };

  _MultiValuedDict.prototype.add_value = function(key, value) {
    var existing;
    if (value === null) {
      throw new Error("Can't put null in this dict");
    }
    if (_.isArray(value)) {
      throw new Error("Can't put arrays in this dict");
    }
    existing = this._existing(key);
    if (existing === null) {
      return this._dict[key] = value;
    } else if (_.isArray(existing)) {
      return existing.push(value);
    } else {
      return this._dict[key] = [existing, value];
    }
  };

  _MultiValuedDict.prototype.remove_value = function(key, value) {
    var existing, new_array;
    existing = this._existing(key);
    if (_.isArray(existing)) {
      new_array = _.without(existing, value);
      if (new_array.length > 0) {
        return this._dict[key] = new_array;
      } else {
        return delete this._dict[key];
      }
    } else if (_.isEqual(existing, value)) {
      return delete this._dict[key];
    }
  };

  _MultiValuedDict.prototype.get_one = function(key, duplicate_error) {
    var existing;
    existing = this._existing(key);
    if (_.isArray(existing)) {
      if (existing.length === 1) {
        return existing[0];
      } else {
        throw new Error(duplicate_error);
      }
    } else {
      return existing;
    }
  };

  return _MultiValuedDict;

})();

Document = (function() {
  function Document() {
    this._title = DEFAULT_TITLE;
    this._roots = [];
    this._all_models = {};
    this._all_models_by_name = new _MultiValuedDict();
    this._all_model_counts = {};
    this._callbacks = [];
  }

  Document.prototype.clear = function() {
    var results;
    results = [];
    while (this._roots.length > 0) {
      results.push(this.remove_root(this._roots[0]));
    }
    return results;
  };

  Document.prototype._destructively_move = function(dest_doc) {
    var r;
    dest_doc.clear();
    while (this._roots.length > 0) {
      r = this._roots[0];
      this.remove_root(r);
      dest_doc.add_root(r);
    }
    return dest_doc.set_title(this._title);
  };

  Document.prototype.roots = function() {
    return this._roots;
  };

  Document.prototype.add_root = function(model) {
    if (indexOf.call(this._roots, model) >= 0) {
      return;
    }
    this._roots.push(model);
    model.attach_document(this);
    return this._trigger_on_change(new RootAddedEvent(this, model));
  };

  Document.prototype.remove_root = function(model) {
    var i;
    i = this._roots.indexOf(model);
    if (i < 0) {
      return;
    } else {
      this._roots.splice(i, 1);
    }
    model.detach_document();
    return this._trigger_on_change(new RootRemovedEvent(this, model));
  };

  Document.prototype.title = function() {
    return this._title;
  };

  Document.prototype.set_title = function(title) {
    if (title !== this._title) {
      this._title = title;
      return this._trigger_on_change(new TitleChangedEvent(this, title));
    }
  };

  Document.prototype.get_model_by_id = function(model_id) {
    if (model_id in this._all_models) {
      return this._all_models[model_id];
    } else {
      return null;
    }
  };

  Document.prototype.get_model_by_name = function(name) {
    return this._all_models_by_name.get_one(name, "Multiple models are named '" + name + "'");
  };

  Document.prototype.on_change = function(callback) {
    if (indexOf.call(this._callbacks, callback) >= 0) {
      return;
    }
    return this._callbacks.push(callback);
  };

  Document.prototype.remove_on_change = function(callback) {
    var i;
    i = this._callbacks.indexOf(callback);
    if (i >= 0) {
      return this._callbacks.splice(i, 1);
    }
  };

  Document.prototype._trigger_on_change = function(event) {
    var cb, j, len, ref1, results;
    ref1 = this._callbacks;
    results = [];
    for (j = 0, len = ref1.length; j < len; j++) {
      cb = ref1[j];
      results.push(cb(event));
    }
    return results;
  };

  Document.prototype._notify_change = function(model, attr, old, new_) {
    if (attr === 'name') {
      this._all_models_by_name.remove_value(old, model);
      if (new_ !== null) {
        this._all_models_by_name.add_value(new_, model);
      }
    }
    return this._trigger_on_change(new ModelChangedEvent(this, model, attr, old, new_));
  };

  Document.prototype._notify_attach = function(model) {
    var name;
    if (!model.serializable_in_document()) {
      console.log("Attempted to attach nonserializable to document ", model);
      throw new Error("Should not attach nonserializable model " + model.constructor.name + " to document");
    }
    if (model.id in this._all_model_counts) {
      this._all_model_counts[model.id] = this._all_model_counts[model.id] + 1;
    } else {
      this._all_model_counts[model.id] = 1;
    }
    this._all_models[model.id] = model;
    name = model.get('name');
    if (name !== null) {
      return this._all_models_by_name.add_value(name, model);
    }
  };

  Document.prototype._notify_detach = function(model) {
    var attach_count, name;
    this._all_model_counts[model.id] -= 1;
    attach_count = this._all_model_counts[model.id];
    if (attach_count === 0) {
      delete this._all_models[model.id];
      delete this._all_model_counts[model.id];
      name = model.get('name');
      if (name !== null) {
        this._all_models_by_name.remove_value(name, model);
      }
    }
    return attach_count;
  };

  Document._references_json = function(references, include_defaults) {
    var j, len, r, ref, references_json;
    if (include_defaults == null) {
      include_defaults = true;
    }
    references_json = [];
    for (j = 0, len = references.length; j < len; j++) {
      r = references[j];
      if (!r.serializable_in_document()) {
        console.log("nonserializable value in references ", r);
        throw new Error("references should never contain nonserializable value");
      }
      ref = r.ref();
      ref['attributes'] = r.attributes_as_json(include_defaults);
      delete ref['attributes']['id'];
      references_json.push(ref);
    }
    return references_json;
  };

  Document._instantiate_object = function(obj_id, obj_type, obj_attrs) {
    var coll, full_attrs;
    full_attrs = _.extend({}, obj_attrs, {
      id: obj_id
    });
    coll = Collections(obj_type);
    if (coll == null) {
      throw new Error("unknown model type " + obj_type + " for " + obj_id);
    }
    return new coll.model(full_attrs, {
      'silent': true,
      'defer_initialization': true
    });
  };

  Document._instantiate_references_json = function(references_json, existing_models) {
    var instance, j, len, obj, obj_attrs, obj_id, obj_type, references;
    references = {};
    for (j = 0, len = references_json.length; j < len; j++) {
      obj = references_json[j];
      obj_id = obj['id'];
      obj_type = obj['type'];
      obj_attrs = obj['attributes'];
      if (obj_id in existing_models) {
        instance = existing_models[obj_id];
      } else {
        instance = Document._instantiate_object(obj_id, obj_type, obj_attrs);
        if ('subtype' in obj) {
          instance.set_subtype(obj['subtype']);
        }
      }
      references[instance.id] = instance;
    }
    return references;
  };

  Document._resolve_refs = function(value, old_references, new_references) {
    var resolve_array, resolve_dict, resolve_ref;
    resolve_ref = function(v) {
      if (is_ref(v)) {
        if (v['id'] in old_references) {
          return old_references[v['id']];
        } else if (v['id'] in new_references) {
          return new_references[v['id']];
        } else {
          throw new Error("reference " + (JSON.stringify(v)) + " isn't known (not in Document?)");
        }
      } else if (_.isArray(v)) {
        return resolve_array(v);
      } else if (_.isObject(v)) {
        return resolve_dict(v);
      } else {
        return v;
      }
    };
    resolve_dict = function(dict) {
      var k, resolved, v;
      resolved = {};
      for (k in dict) {
        v = dict[k];
        resolved[k] = resolve_ref(v);
      }
      return resolved;
    };
    resolve_array = function(array) {
      var j, len, results, v;
      results = [];
      for (j = 0, len = array.length; j < len; j++) {
        v = array[j];
        results.push(resolve_ref(v));
      }
      return results;
    };
    return resolve_ref(value);
  };

  Document._initialize_references_json = function(references_json, old_references, new_references) {
    var foreach_depth_first, instance, j, len, obj, obj_attrs, obj_id, to_update, was_new;
    to_update = {};
    for (j = 0, len = references_json.length; j < len; j++) {
      obj = references_json[j];
      obj_id = obj['id'];
      obj_attrs = obj['attributes'];
      was_new = false;
      instance = obj_id in old_references ? old_references[obj_id] : (was_new = true, new_references[obj_id]);
      obj_attrs = Document._resolve_refs(obj_attrs, old_references, new_references);
      to_update[instance.id] = [instance, obj_attrs, was_new];
    }
    foreach_depth_first = function(items, f) {
      var already_started, foreach_value, k, results, v;
      already_started = {};
      foreach_value = function(v, f) {
        var a, attrs, e, k, l, len1, ref1, results, results1, same_as_v;
        if (v instanceof HasProps) {
          if (!(v.id in already_started) && v.id in items) {
            already_started[v.id] = true;
            ref1 = items[v.id], same_as_v = ref1[0], attrs = ref1[1], was_new = ref1[2];
            for (a in attrs) {
              e = attrs[a];
              foreach_value(e, f);
            }
            return f(v, attrs, was_new);
          }
        } else if (_.isArray(v)) {
          results = [];
          for (l = 0, len1 = v.length; l < len1; l++) {
            e = v[l];
            results.push(foreach_value(e, f));
          }
          return results;
        } else if (_.isObject(v)) {
          results1 = [];
          for (k in v) {
            e = v[k];
            results1.push(foreach_value(e, f));
          }
          return results1;
        }
      };
      results = [];
      for (k in items) {
        v = items[k];
        results.push(foreach_value(v[0], f));
      }
      return results;
    };
    foreach_depth_first(to_update, function(instance, attrs, was_new) {
      if (was_new) {
        return instance.set(attrs);
      }
    });
    return foreach_depth_first(to_update, function(instance, attrs, was_new) {
      if (was_new) {
        return instance.initialize(attrs);
      }
    });
  };

  Document._event_for_attribute_change = function(changed_obj, key, new_value, doc, value_refs) {
    var changed_model, event;
    changed_model = doc.get_model_by_id(changed_obj.id);
    if (!changed_model.attribute_is_serializable(key)) {
      return null;
    }
    event = {
      'kind': 'ModelChanged',
      'model': {
        id: changed_obj.id,
        type: changed_obj.type
      },
      'attr': key,
      'new': new_value
    };
    HasProps._json_record_references(doc, new_value, value_refs, true);
    return event;
  };

  Document._events_to_sync_objects = function(from_obj, to_obj, to_doc, value_refs) {
    var added, events, from_keys, j, key, l, len, len1, len2, m, new_value, old_value, removed, shared, to_keys;
    from_keys = Object.keys(from_obj.attributes);
    to_keys = Object.keys(to_obj.attributes);
    removed = _.difference(from_keys, to_keys);
    added = _.difference(to_keys, from_keys);
    shared = _.intersection(from_keys, to_keys);
    events = [];
    for (j = 0, len = removed.length; j < len; j++) {
      key = removed[j];
      logger.warn("Server sent key " + key + " but we don't seem to have it in our JSON");
    }
    for (l = 0, len1 = added.length; l < len1; l++) {
      key = added[l];
      new_value = to_obj.attributes[key];
      events.push(Document._event_for_attribute_change(from_obj, key, new_value, to_doc, value_refs));
    }
    for (m = 0, len2 = shared.length; m < len2; m++) {
      key = shared[m];
      old_value = from_obj.attributes[key];
      new_value = to_obj.attributes[key];
      if (old_value === null && new_value === null) {

      } else if (old_value === null || new_value === null) {
        events.push(Document._event_for_attribute_change(from_obj, key, new_value, to_doc, value_refs));
      } else {
        if (!_.isEqual(old_value, new_value)) {
          events.push(Document._event_for_attribute_change(from_obj, key, new_value, to_doc, value_refs));
        }
      }
    }
    return _.filter(events, function(e) {
      return e !== null;
    });
  };

  Document._compute_patch_since_json = function(from_json, to_doc) {
    var events, from_references, from_root_ids, from_roots, id, include_defaults, j, l, len, len1, model, r, ref1, ref2, ref3, refs, to_json, to_references, to_root_ids, to_roots, update_model_events, value_refs;
    to_json = to_doc.to_json(include_defaults = false);
    refs = function(json) {
      var j, len, obj, ref1, result;
      result = {};
      ref1 = json['roots']['references'];
      for (j = 0, len = ref1.length; j < len; j++) {
        obj = ref1[j];
        result[obj.id] = obj;
      }
      return result;
    };
    from_references = refs(from_json);
    from_roots = {};
    from_root_ids = [];
    ref1 = from_json['roots']['root_ids'];
    for (j = 0, len = ref1.length; j < len; j++) {
      r = ref1[j];
      from_roots[r] = from_references[r];
      from_root_ids.push(r);
    }
    to_references = refs(to_json);
    to_roots = {};
    to_root_ids = [];
    ref2 = to_json['roots']['root_ids'];
    for (l = 0, len1 = ref2.length; l < len1; l++) {
      r = ref2[l];
      to_roots[r] = to_references[r];
      to_root_ids.push(r);
    }
    from_root_ids.sort();
    to_root_ids.sort();
    if (_.difference(from_root_ids, to_root_ids).length > 0 || _.difference(to_root_ids, from_root_ids).length > 0) {
      throw new Error("Not implemented: computing add/remove of document roots");
    }
    value_refs = {};
    events = [];
    ref3 = to_doc._all_models;
    for (id in ref3) {
      model = ref3[id];
      if (id in from_references) {
        update_model_events = Document._events_to_sync_objects(from_references[id], to_references[id], to_doc, value_refs);
        events = events.concat(update_model_events);
      }
    }
    return {
      'events': events,
      'references': Document._references_json(_.values(value_refs), include_defaults = false)
    };
  };

  Document.prototype.to_json_string = function(include_defaults) {
    if (include_defaults == null) {
      include_defaults = true;
    }
    return JSON.stringify(this.to_json(include_defaults));
  };

  Document.prototype.to_json = function(include_defaults) {
    var j, k, len, r, ref1, root_ids, root_references, v;
    if (include_defaults == null) {
      include_defaults = true;
    }
    root_ids = [];
    ref1 = this._roots;
    for (j = 0, len = ref1.length; j < len; j++) {
      r = ref1[j];
      root_ids.push(r.id);
    }
    root_references = (function() {
      var ref2, results;
      ref2 = this._all_models;
      results = [];
      for (k in ref2) {
        v = ref2[k];
        results.push(v);
      }
      return results;
    }).call(this);
    return {
      'title': this._title,
      'roots': {
        'root_ids': root_ids,
        'references': Document._references_json(root_references, include_defaults)
      }
    };
  };

  Document.from_json_string = function(s) {
    var json;
    if (s === null || (s == null)) {
      throw new Error("JSON string is " + (typeof s));
    }
    json = JSON.parse(s);
    return Document.from_json(json);
  };

  Document.from_json = function(json) {
    var doc, j, len, r, references, references_json, root_ids, roots_json;
    if (typeof json !== 'object') {
      throw new Error("JSON object has wrong type " + (typeof json));
    }
    roots_json = json['roots'];
    root_ids = roots_json['root_ids'];
    references_json = roots_json['references'];
    references = Document._instantiate_references_json(references_json, {});
    Document._initialize_references_json(references_json, {}, references);
    doc = new Document();
    for (j = 0, len = root_ids.length; j < len; j++) {
      r = root_ids[j];
      doc.add_root(references[r]);
    }
    doc.set_title(json['title']);
    return doc;
  };

  Document.prototype.replace_with_json = function(json) {
    var replacement;
    replacement = Document.from_json(json);
    return replacement._destructively_move(this);
  };

  Document.prototype.create_json_patch_string = function(events) {
    return JSON.stringify(this.create_json_patch(events));
  };

  Document.prototype.create_json_patch = function(events) {
    var event, id, j, json_event, json_events, len, references, value, value_json, value_refs;
    references = {};
    json_events = [];
    for (j = 0, len = events.length; j < len; j++) {
      event = events[j];
      if (event.document !== this) {
        console.log("Cannot create a patch using events from a different document, event had ", event.document, " we are ", this);
        throw new Error("Cannot create a patch using events from a different document");
      }
      if (event instanceof ModelChangedEvent) {
        if (event.attr === 'id') {
          console.log("'id' field is immutable and should never be in a ModelChangedEvent ", event);
          throw new Error("'id' field should never change, whatever code just set it is wrong");
        }
        value = event.new_;
        value_json = HasProps._value_to_json('new_', value, event.model);
        value_refs = {};
        HasProps._value_record_references(value, value_refs, true);
        if (event.model.id in value_refs && event.model !== value) {
          delete value_refs[event.model.id];
        }
        for (id in value_refs) {
          references[id] = value_refs[id];
        }
        json_event = {
          'kind': 'ModelChanged',
          'model': event.model.ref(),
          'attr': event.attr,
          'new': value_json
        };
        json_events.push(json_event);
      } else if (event instanceof RootAddedEvent) {
        HasProps._value_record_references(event.model, references, true);
        json_event = {
          'kind': 'RootAdded',
          'model': event.model.ref()
        };
        json_events.push(json_event);
      } else if (event instanceof RootRemovedEvent) {
        json_event = {
          'kind': 'RootRemoved',
          'model': event.model.ref()
        };
        json_events.push(json_event);
      } else if (event instanceof TitleChangedEvent) {
        json_event = {
          'kind': 'TitleChanged',
          'title': event.title
        };
        json_events.push(json_event);
      }
    }
    return {
      'events': json_events,
      'references': Document._references_json(_.values(references))
    };
  };

  Document.prototype.apply_json_patch_string = function(patch) {
    return this.apply_json_patch(JSON.parse(patch));
  };

  Document.prototype.apply_json_patch = function(patch) {
    var attr, column_source, column_source_id, data, event_json, events_json, id, j, l, len, len1, model_id, new_references, obj1, old_references, patched_id, patched_obj, references, references_json, results, rollover, root_id, root_obj, value;
    references_json = patch['references'];
    events_json = patch['events'];
    references = Document._instantiate_references_json(references_json, this._all_models);
    for (j = 0, len = events_json.length; j < len; j++) {
      event_json = events_json[j];
      if ('model' in event_json) {
        model_id = event_json['model']['id'];
        if (model_id in this._all_models) {
          references[model_id] = this._all_models[model_id];
        } else {
          console.log("Got an event for unknown model ", event_json['model']);
          throw new Error("event model wasn't known");
        }
      }
    }
    old_references = {};
    new_references = {};
    for (id in references) {
      value = references[id];
      if (id in this._all_models) {
        old_references[id] = value;
      } else {
        new_references[id] = value;
      }
    }
    Document._initialize_references_json(references_json, old_references, new_references);
    results = [];
    for (l = 0, len1 = events_json.length; l < len1; l++) {
      event_json = events_json[l];
      if (event_json['kind'] === 'ModelChanged') {
        patched_id = event_json['model']['id'];
        if (!(patched_id in this._all_models)) {
          throw new Error("Cannot apply patch to " + patched_id + " which is not in the document");
        }
        patched_obj = this._all_models[patched_id];
        attr = event_json['attr'];
        value = Document._resolve_refs(event_json['new'], old_references, new_references);
        results.push(patched_obj.set((
          obj1 = {},
          obj1["" + attr] = value,
          obj1
        )));
      } else if (event_json['kind'] === 'ColumnsStreamed') {
        column_source_id = event_json['column_source']['id'];
        if (!(column_source_id in this._all_models)) {
          throw new Error("Cannot stream to " + column_source_id + " which is not in the document");
        }
        column_source = this._all_models[column_source_id];
        data = event_json['data'];
        rollover = event_json['rollover'];
        results.push(column_source.stream(data, rollover));
      } else if (event_json['kind'] === 'RootAdded') {
        root_id = event_json['model']['id'];
        root_obj = references[root_id];
        results.push(this.add_root(root_obj));
      } else if (event_json['kind'] === 'RootRemoved') {
        root_id = event_json['model']['id'];
        root_obj = references[root_id];
        results.push(this.remove_root(root_obj));
      } else if (event_json['kind'] === 'TitleChanged') {
        results.push(this.set_title(event_json['title']));
      } else {
        throw new Error("Unknown patch event " + JSON.stringify(event_json));
      }
    }
    return results;
  };

  return Document;

})();

module.exports = {
  Document: Document,
  DocumentChangedEvent: DocumentChangedEvent,
  ModelChangedEvent: ModelChangedEvent,
  TitleChangedEvent: TitleChangedEvent,
  RootAddedEvent: RootAddedEvent,
  RootRemovedEvent: RootRemovedEvent,
  DEFAULT_TITLE: DEFAULT_TITLE
};
