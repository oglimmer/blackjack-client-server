
#include "GameControllerSimpleWinTest.hpp"
#include "GameControllerDealerBlackJackTest.hpp"
#include "BlackJackUnitTest.hpp"
#include "GameControllerInsuranceTest.hpp"

#include <iostream>

void runTests() {
//    OATPP_RUN_TEST(BlackJackUnitTest);
//    OATPP_RUN_TEST(GameControllerSimpleWinTest);
//    OATPP_RUN_TEST(GameControllerDealerBlackJackTest);
    OATPP_RUN_TEST(GameControllerInsuranceTest);
}

int main() {

    oatpp::base::Environment::init();

    runTests();

    /* Print how much objects were created during app running, and what have left-probably leaked */
    /* Disable object counting for release builds using '-D OATPP_DISABLE_ENV_OBJECT_COUNTERS' flag for better performance */
    std::cout << "\nEnvironment:\n";
    std::cout << "objectsCount = " << oatpp::base::Environment::getObjectsCount() << "\n";
    std::cout << "objectsCreated = " << oatpp::base::Environment::getObjectsCreated() << "\n\n";

    OATPP_ASSERT(oatpp::base::Environment::getObjectsCount() == 0);

    oatpp::base::Environment::destroy();

    return 0;
}
