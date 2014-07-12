TEST_TIMEOUT = 2000
TEST_REPORTER = spec

test:
	@NODE_ENV=test \
		./node_modules/.bin/mocha \
			--require should \
			--timeout $(TEST_TIMEOUT) \
			--reporter $(TEST_REPORTER) \
			--recursive \
			--check-leaks \
			--bail \
			test

test-cov: src-cov
	@TEST_COV=1 $(MAKE) test TEST_REPORTER=html-cov > coverage.html

src-cov: clean
	@jscoverage src src-cov

benchmark:
	@node benchmark/benchmark.js

clean:
	@rm -f coverage.html
	@rm -rf src-cov

.PHONY: test test-cov src-cov benchmark clean
