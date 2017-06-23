BUILD = build
SRC = src
NODE_MODULES=node_modules

JS_SRC = $(shell find src -name *.js)
CSS_SRC = $(shell find src -name *.css)

LIVERELOAD = $(NODE_MODULES)/livereload/bin/livereload.js
CHOKIDAR = $(NODE_MODULES)/chokidar-cli/index.js
HTTP = $(NODE_MODULES)/http-server/bin/http-server
ROLLUP = $(NODE_MODULES)/rollup/bin/rollup

default: build

build: $(BUILD)/app.js $(BUILD)/app.css $(BUILD)/index.html $(BUILD)/d3.js

$(BUILD)/app.js: $(JS_SRC)
	mkdir -p $(@D)
	$(ROLLUP) -f iife -o $(BUILD)/app.js -g d3:d3 -m inline $(SRC)/app.js 

$(BUILD)/app.css: $(CSS_SRC)
	mkdir -p $(@D)
	cat $(CSS_SRC) > $@

$(BUILD)/index.html: $(SRC)/index.html
	mkdir -p $(@D)
	cp $(SRC)/index.html $@

$(BUILD)/d3.js: $(NODE_MODULES)/d3/build/d3.js
	mkdir -p $(@D)
	cp $(NODE_MODULES)/d3/build/d3.js $@

# watch filesystem for changes and rebuild
# various pieces as needed
watch:
	$(MAKE) build
	$(MAKE) watch-all -j

# NOTE - you dont want this one, you just want watch
watch-all: livereload serve watch-css watch-js watch-index

watch-js:
	$(CHOKIDAR) $(JS_SRC) -c "make $(BUILD)/app.js"

watch-css:
	$(CHOKIDAR) $(CSS_SRC) -c "make $(BUILD)/app.css"

watch-index:
	$(CHOKIDAR) $(SRC)/index.html -c "make $(BUILD)/index.html"

serve:
	$(HTTP) $(BUILD)

# start livereload server to update browser on changes
livereload:
	$(LIVERELOAD) $(BUILD) -w 500 -d

clean:
	rm -rf build/*

.PHONY: watch watch-all watch-js watch-css watch-index serve livereload
